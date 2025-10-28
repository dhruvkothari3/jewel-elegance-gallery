import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          slug: string
          name: string
          description: string | null
          image: string | null
          images: string[]
          type: 'ring' | 'necklace' | 'earring' | 'bracelet' | 'bangle'
          material: 'gold' | 'diamond' | 'platinum' | 'rose-gold'
          occasion: 'bridal' | 'festive' | 'daily-wear' | 'gift' | null
          collection_id: string | null
          sku: string | null
          sizes: string[]
          stock: number
          featured: boolean
          most_loved: boolean
          new_arrival: boolean
          meta_title: string | null
          meta_description: string | null
          created_by: string | null
          updated_by: string | null
          created_at: string
          updated_at: string
          is_deleted: boolean
        }
        Insert: {
          slug: string
          name: string
          description?: string | null
          image?: string | null
          images?: string[]
          type: 'ring' | 'necklace' | 'earring' | 'bracelet' | 'bangle'
          material: 'gold' | 'diamond' | 'platinum' | 'rose-gold'
          occasion?: 'bridal' | 'festive' | 'daily-wear' | 'gift' | null
          collection_id?: string | null
          sku?: string | null
          sizes?: string[]
          stock?: number
          featured?: boolean
          most_loved?: boolean
          new_arrival?: boolean
          meta_title?: string | null
          meta_description?: string | null
        }
        Update: {
          slug?: string
          name?: string
          description?: string | null
          image?: string | null
          images?: string[]
          type?: 'ring' | 'necklace' | 'earring' | 'bracelet' | 'bangle'
          material?: 'gold' | 'diamond' | 'platinum' | 'rose-gold'
          occasion?: 'bridal' | 'festive' | 'daily-wear' | 'gift' | null
          collection_id?: string | null
          sku?: string | null
          sizes?: string[]
          stock?: number
          featured?: boolean
          most_loved?: boolean
          new_arrival?: boolean
          meta_title?: string | null
          meta_description?: string | null
          is_deleted?: boolean
        }
      }
      collections: {
        Row: {
          id: string
          handle: string
          name: string
          description: string | null
          banner_image: string | null
          created_at: string
          created_by: string | null
        }
      }
    }
  }
}

const supabase = createClient<Database>(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? ''
)

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

async function handleGet(req: Request) {
  const url = new URL(req.url)
  const pathSegments = url.pathname.split('/').filter(Boolean)
  
  // GET /products/:slug - single product
  if (pathSegments.length >= 2 && pathSegments[1] !== '') {
    const slug = pathSegments[1]
    
    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        collections!inner(id, handle, name, description)
      `)
      .eq('slug', slug)
      .eq('is_deleted', false)
      .single()

    if (error) {
      return new Response(JSON.stringify({ error: 'Product not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify(product), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  // GET /products - list with filters
  const searchParams = url.searchParams
  let query = supabase
    .from('products')
    .select(`
      *,
      collections(id, handle, name, description)
    `)
    .eq('is_deleted', false)

  // Apply filters
  if (searchParams.get('type')) {
    query = query.eq('type', searchParams.get('type'))
  }
  if (searchParams.get('material')) {
    query = query.eq('material', searchParams.get('material'))
  }
  if (searchParams.get('occasion')) {
    query = query.eq('occasion', searchParams.get('occasion'))
  }
  if (searchParams.get('collection')) {
    query = query.eq('collections.handle', searchParams.get('collection'))
  }
  if (searchParams.get('featured') === 'true') {
    query = query.eq('featured', true)
  }
  if (searchParams.get('most_loved') === 'true') {
    query = query.eq('most_loved', true)
  }
  if (searchParams.get('new_arrival') === 'true') {
    query = query.eq('new_arrival', true)
  }

  // Search by name or SKU
  if (searchParams.get('search')) {
    const searchTerm = searchParams.get('search')!
    query = query.or(`name.ilike.%${searchTerm}%,sku.ilike.%${searchTerm}%`)
  }

  // Sorting
  const sort = searchParams.get('sort') || 'created_at'
  const order = searchParams.get('order') || 'desc'
  query = query.order(sort, { ascending: order === 'asc' })

  // Pagination
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const from = (page - 1) * limit
  const to = from + limit - 1

  query = query.range(from, to)

  const { data: products, error, count } = await query

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  return new Response(JSON.stringify({
    products,
    pagination: {
      page,
      limit,
      total: count,
      totalPages: Math.ceil((count || 0) / limit)
    }
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function handlePost(req: Request) {
  const body = await req.json()
  
  // Validate required fields
  if (!body.name || !body.type || !body.material) {
    return new Response(JSON.stringify({ 
      error: 'Missing required fields: name, type, material' 
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  // Auto-generate slug if not provided
  if (!body.slug) {
    body.slug = generateSlug(body.name)
  }

  // Get user from JWT
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Authorization required' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  
  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'Invalid token' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  // Set created_by
  body.created_by = user.id

  // Insert with retry excluding 'image' if PostgREST schema cache is stale
  let insertError: any = null
  let product: any = null
  {
    const res = await supabase
      .from('products')
      .insert(body)
      .select()
      .single()
    insertError = res.error
    product = res.data
  }
  if (
    insertError && (
      (insertError.code && String(insertError.code) === 'PGRST204') ||
      (typeof insertError.message === 'string' && (
        insertError.message.includes("'image' column") ||
        insertError.message.toLowerCase().includes('schema cache') ||
        insertError.message.toLowerCase().includes('image')
      ))
    )
  ) {
    const { image, ...rest } = body
    const res2 = await supabase
      .from('products')
      .insert(rest)
      .select()
      .single()
    insertError = res2.error
    product = res2.data
  }

  if (insertError) {
    return new Response(JSON.stringify({ error: insertError.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  return new Response(JSON.stringify(product), {
    status: 201,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function handlePut(req: Request) {
  const url = new URL(req.url)
  const pathSegments = url.pathname.split('/').filter(Boolean)
  
  if (pathSegments.length < 2) {
    return new Response(JSON.stringify({ error: 'Product slug required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  const slug = pathSegments[1]
  const body = await req.json()

  // Get user from JWT
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Authorization required' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  
  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'Invalid token' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  // Set updated_by
  body.updated_by = user.id

  // Update with retry excluding 'image' if schema cache is stale
  let updateError: any = null
  let product: any = null
  {
    const res = await supabase
      .from('products')
      .update(body)
      .eq('slug', slug)
      .select()
      .single()
    updateError = res.error
    product = res.data
  }
  if (
    updateError && (
      (updateError.code && String(updateError.code) === 'PGRST204') ||
      (typeof updateError.message === 'string' && (
        updateError.message.includes("'image' column") ||
        updateError.message.toLowerCase().includes('schema cache') ||
        updateError.message.toLowerCase().includes('image')
      ))
    )
  ) {
    const { image, ...rest } = body
    const res2 = await supabase
      .from('products')
      .update(rest)
      .eq('slug', slug)
      .select()
      .single()
    updateError = res2.error
    product = res2.data
  }

  if (updateError) {
    return new Response(JSON.stringify({ error: updateError.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  return new Response(JSON.stringify(product), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function handleDelete(req: Request) {
  const url = new URL(req.url)
  const pathSegments = url.pathname.split('/').filter(Boolean)
  
  if (pathSegments.length < 2) {
    return new Response(JSON.stringify({ error: 'Product slug required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  const slug = pathSegments[1]

  // Get user from JWT for audit trail
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Authorization required' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  
  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'Invalid token' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  // Soft delete
  const { data: product, error } = await supabase
    .from('products')
    .update({ 
      is_deleted: true,
      updated_by: user.id
    })
    .eq('slug', slug)
    .select()
    .single()

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  return new Response(JSON.stringify({ message: 'Product deleted successfully' }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    switch (req.method) {
      case 'GET':
        return await handleGet(req)
      case 'POST':
        return await handlePost(req)
      case 'PUT':
        return await handlePut(req)
      case 'DELETE':
        return await handleDelete(req)
      default:
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})