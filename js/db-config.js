// CONFIGURACIÓN DE SUPABASE (Tus llaves)
const supabaseUrl = 'https://gxzrpbvfazkoigjspgpy.supabase.co';
const supabaseKey = 'sb_publishable_6WfHe1ntjoO3Zo_BZPRLww_3CetYHJd'; // Tu Anon Key

// Inicializamos la conexión
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

console.log("Supabase conectado correctamente para MB Studio.");