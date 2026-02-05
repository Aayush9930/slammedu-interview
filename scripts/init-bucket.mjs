import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "http://127.0.0.1:54321";
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function createBucket() {
    const { data, error } = await supabase.storage.createBucket("uploads", {
        public: true,
    });

    if (error) {
        if (error.message.includes("already exists")) {
            console.log("Bucket 'uploads' already exists.");
        } else {
            console.error("Error creating bucket:", error);
        }
    } else {
        console.log("Bucket 'uploads' created successfully.");
    }
}

createBucket();
