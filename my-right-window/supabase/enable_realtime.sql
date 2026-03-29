-- Fix to enable real-time features on the home page for new schema tables
ALTER PUBLICATION supabase_realtime ADD TABLE blogs, judgements;
