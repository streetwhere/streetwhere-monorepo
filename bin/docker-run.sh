#!/bin/bash

dotenvx run --env-file=.env.local -- docker run --rm -it --env SUPABASE_ANON_KEY --env SUPABASE_DATABASE_URL --env SUPABASE_URL streetwheremail:latest