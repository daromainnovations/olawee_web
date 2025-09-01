
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "./authProviderContext";

const ProjectsContext = createContext();

export const ProjectsProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { user } = useAuth();

  // Fetch de proyectos (solo una vez, o cuando se quiera refrescar)
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError("");

    try {

      if (!user?.id) {
        setError("Usuario no autenticado.");
        setProjects([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('n8n_chats_okapi_principal')
        .select('*')
        .eq('user_session_id', user.id);
      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      setError(err.message || "Error loading projects");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user?.id) {
      fetchProjects();
    }
  }, [fetchProjects, user?.id]);

  return (
    <ProjectsContext.Provider value={{ projects, loading, error, refreshProjects: fetchProjects }}>
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjects = () => useContext(ProjectsContext);
