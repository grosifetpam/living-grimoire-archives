import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for the PASSWORD_RECOVERY event from the email link
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecovery(true);
      }
    });

    // Also check hash for recovery type
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setIsRecovery(true);
    }

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 12) {
      toast({ title: "Erreur", description: "Le mot de passe doit contenir au moins 12 caractères.", variant: "destructive" });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: "Erreur", description: "Les mots de passe ne correspondent pas.", variant: "destructive" });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Mot de passe modifié ✓", description: "Vous pouvez maintenant vous connecter." });
      navigate("/admin/login");
    }
    setLoading(false);
  };

  return (
    <Layout>
      <section className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full"
        >
          <div className="relative bg-gradient-to-br from-[hsl(var(--parchment))] to-[hsl(var(--parchment-light))] border-2 border-primary/40 rounded-sm p-8 md:p-12 shadow-[inset_0_0_60px_rgba(0,0,0,0.3),0_0_30px_hsl(var(--gold)/0.2)]">
            <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-primary/30 to-transparent" />
            <div className="absolute left-3 top-0 bottom-0 w-px bg-primary/20" />
            <div className="absolute top-3 left-5 text-primary/30 text-2xl font-cinzel">✦</div>
            <div className="absolute top-3 right-3 text-primary/30 text-2xl font-cinzel">✦</div>
            <div className="absolute bottom-3 left-5 text-primary/30 text-2xl font-cinzel">✦</div>
            <div className="absolute bottom-3 right-3 text-primary/30 text-2xl font-cinzel">✦</div>
            <div className="absolute inset-5 left-7 border border-primary/15 rounded-sm pointer-events-none" />

            <div className="relative z-10">
              <motion.div
                animate={{ scale: [1, 1.05, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-5xl text-center mb-4"
              >
                🔑
              </motion.div>

              <div className="text-center mb-8">
                <div className="text-primary/30 text-xs font-cinzel tracking-[0.3em] mb-2">✦ ARCHIVES SECRÈTES ✦</div>
                <h1 className="font-cinzel text-2xl md:text-3xl font-bold text-primary text-glow-gold">
                  Nouveau mot de passe
                </h1>
                <p className="font-crimson text-muted-foreground italic mt-2">
                  {isRecovery
                    ? "Choisissez un nouveau mot de passe sécurisé"
                    : "Vérification en cours..."}
                </p>
              </div>

              {isRecovery ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    type="password"
                    placeholder="Nouveau mot de passe (12+ caractères)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-secondary/50 border-primary/30 focus:border-primary font-crimson"
                    required
                    minLength={12}
                  />
                  <Input
                    type="password"
                    placeholder="Confirmer le mot de passe"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-secondary/50 border-primary/30 focus:border-primary font-crimson"
                    required
                    minLength={12}
                  />
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full font-cinzel bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30 hover:border-primary/60 transition-all"
                  >
                    {loading ? "..." : "Changer le mot de passe"}
                  </Button>
                </form>
              ) : (
                <p className="text-center font-crimson text-muted-foreground">
                  Si vous avez suivi un lien de réinitialisation, veuillez patienter...
                </p>
              )}

              <div className="mt-6 pt-4 border-t border-primary/15">
                <button
                  onClick={() => navigate("/admin/login")}
                  className="text-sm text-primary/50 hover:text-primary font-crimson w-full text-center block transition-colors"
                >
                  Retour à la connexion
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </Layout>
  );
};

export default ResetPasswordPage;
