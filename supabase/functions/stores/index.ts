import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface Database {
  public: {
    Tables: {
      stores: {
        Row: {
          id: string
          store_name: string
          city: string | null
          address: string | null
          phone: string | null
          hours: string | null
          map_link: string | null
          lat: number | null
          lng: number | null
          created_at: string
        }
        Insert: {
          store_name: string
          city?: string | null
          address?: string | null
          phone?: string | null
          hours?: string | null
          map_link?: string | null
          lat?: number | null
          lng?: number | null
        }
        Update: {
          store_name?: string
          city?: string | null
          address?: string | null
          phone?: string | null
          hours?: string | null
          map_link?: string | null
          lat?: number | null
          lng?: number | null
        }
      }
    }
  }
}

const supabase = createClient<Database>(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? ''
)

async function handleGet(req: Request) {
  const url = new URL(req.url)
  const searchParams = url.searchParams
  
  let query = supabase
    .from('stores')
    .select('*')
    .order('store_name', { ascending: true })

  // Filter by city
  if (searchParams.get('city')) {
    query = query.ilike('city', `%${searchParams.get('city')}%`)
  }

  // Search by store name
  if (searchParams.get('search')) {
    const searchTerm = searchParams.get('search')!
    query = query.or(`store_name.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%,address.ilike.%${searchTerm}%`)
  }

  // Pagination
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '50')
  const from = (page - 1) * limit
  const to = from + limit - 1

  query = query.range(from, to)

  const { data: stores, error, count } = await query

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  return new Response(JSON.stringify({
    stores,
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
  if (!body.store_name) {
    return new Response(JSON.stringify({ 
      error: 'Missing required field: store_name' 
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  // Get user from JWT for admin check
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

  const { data: store, error } = await supabase
    .from('stores')
    .insert(body)
    .select()
    .single()

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  return new Response(JSON.stringify(store), {
    status: 201,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function handlePut(req: Request) {
  const url = new URL(req.url)
  const pathSegments = url.pathname.split('/').filter(Boolean)
  
  if (pathSegments.length < 2) {
    return new Response(JSON.stringify({ error: 'Store ID required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  const storeId = pathSegments[1]
  const body = await req.json()

  // Get user from JWT for admin check
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

  const { data: store, error } = await supabase
    .from('stores')
    .update(body)
    .eq('id', storeId)
    .select()
    .single()

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  return new Response(JSON.stringify(store), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function handleDelete(req: Request) {
  const url = new URL(req.url)
  const pathSegments = url.pathname.split('/').filter(Boolean)
  
  if (pathSegments.length < 2) {
    return new Response(JSON.stringify({ error: 'Store ID required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  const storeId = pathSegments[1]

  // Get user from JWT for admin check
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

  const { error } = await supabase
    .from('stores')
    .delete()
    .eq('id', storeId)

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  return new Response(JSON.stringify({ message: 'Store deleted successfully' }), {
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