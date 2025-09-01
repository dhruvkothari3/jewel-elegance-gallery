import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface Database {
  public: {
    Tables: {
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
        Insert: {
          handle: string
          name: string
          description?: string | null
          banner_image?: string | null
        }
        Update: {
          handle?: string
          name?: string
          description?: string | null
          banner_image?: string | null
        }
      }
      products: {
        Row: {
          id: string
          slug: string
          name: string
          description: string | null
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
          created_at: string
          updated_at: string
          is_deleted: boolean
        }
      }
    }
  }
}

const supabase = createClient<Database>(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? ''
)

function generateHandle(name: string): string {
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
  
  // GET /collections/:handle - single collection with products
  if (pathSegments.length >= 2 && pathSegments[1] !== '') {
    const handle = pathSegments[1]
    
    const { data: collection, error: collectionError } = await supabase
      .from('collections')
      .select('*')
      .eq('handle', handle)
      .single()

    if (collectionError) {
      return new Response(JSON.stringify({ error: 'Collection not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Get products in this collection
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('collection_id', collection.id)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })

    if (productsError) {
      return new Response(JSON.stringify({ error: productsError.message }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({
      ...collection,
      products
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  // GET /collections - list all collections
  const searchParams = url.searchParams
  let query = supabase
    .from('collections')
    .select('*')
    .order('created_at', { ascending: false })

  // Pagination
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const from = (page - 1) * limit
  const to = from + limit - 1

  query = query.range(from, to)

  const { data: collections, error, count } = await query

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  return new Response(JSON.stringify({
    collections,
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
  if (!body.name) {
    return new Response(JSON.stringify({ 
      error: 'Missing required field: name' 
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  // Auto-generate handle if not provided
  if (!body.handle) {
    body.handle = generateHandle(body.name)
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

  const { data: collection, error } = await supabase
    .from('collections')
    .insert(body)
    .select()
    .single()

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  return new Response(JSON.stringify(collection), {
    status: 201,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function handlePut(req: Request) {
  const url = new URL(req.url)
  const pathSegments = url.pathname.split('/').filter(Boolean)
  
  if (pathSegments.length < 2) {
    return new Response(JSON.stringify({ error: 'Collection handle required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  const handle = pathSegments[1]
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

  const { data: collection, error } = await supabase
    .from('collections')
    .update(body)
    .eq('handle', handle)
    .select()
    .single()

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  return new Response(JSON.stringify(collection), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function handleDelete(req: Request) {
  const url = new URL(req.url)
  const pathSegments = url.pathname.split('/').filter(Boolean)
  
  if (pathSegments.length < 2) {
    return new Response(JSON.stringify({ error: 'Collection handle required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  const handle = pathSegments[1]

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

  // Check if collection has products
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id')
    .eq('collection_id', handle)
    .eq('is_deleted', false)
    .limit(1)

  if (productsError) {
    return new Response(JSON.stringify({ error: productsError.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  if (products && products.length > 0) {
    return new Response(JSON.stringify({ 
      error: 'Cannot delete collection that contains products' 
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  const { error } = await supabase
    .from('collections')
    .delete()
    .eq('handle', handle)

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  return new Response(JSON.stringify({ message: 'Collection deleted successfully' }), {
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