import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

const AdminLoginPage = () => {
  const [mode, setMode] = useState<"login" | "reset">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);

    if (mode === "reset") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/login`,
      });
      if (error) {
        toast({ title: "Erreur", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Email envoyé", description: "Vérifiez votre boîte mail pour réinitialiser votre mot de passe." });
        setMode("login");
      }
      setLoading(false);
      return;
    }

    if (!password.trim()) { setLoading(false); return; }

    const { error } = await signIn(email, password);

    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      navigate("/admin");
    }
    setLoading(false);
  };

  const title = mode === "reset" ? "Réinitialiser le mot de passe" : "Connexion";
  const subtitle = mode === "reset" ? "Entrez votre email pour recevoir un lien de réinitialisation" : "Accédez aux archives secrètes";

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
            {/* Book spine */}
            <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-primary/30 to-transparent" />
            <div className="absolute left-3 top-0 bottom-0 w-px bg-primary/20" />

            {/* Corner ornaments */}
            <div className="absolute top-3 left-5 text-primary/30 text-2xl font-cinzel">✦</div>
            <div className="absolute top-3 right-3 text-primary/30 text-2xl font-cinzel">✦</div>
            <div className="absolute bottom-3 left-5 text-primary/30 text-2xl font-cinzel">✦</div>
            <div className="absolute bottom-3 right-3 text-primary/30 text-2xl font-cinzel">✦</div>

            {/* Inner border */}
            <div className="absolute inset-5 left-7 border border-primary/15 rounded-sm pointer-events-none" />

            <div className="relative z-10">
              <motion.div
                animate={{ scale: [1, 1.05, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-5xl text-center mb-4"
              >
                🔐
              </motion.div>

              <div className="text-center mb-8">
                <div className="text-primary/30 text-xs font-cinzel tracking-[0.3em] mb-2">✦ ARCHIVES SECRÈTES ✦</div>
                <h1 className="font-cinzel text-2xl md:text-3xl font-bold text-primary text-glow-gold">
                  {title}
                </h1>
                <p className="font-crimson text-muted-foreground italic mt-2">
                  {subtitle}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-secondary/50 border-primary/30 focus:border-primary font-crimson"
                  required
                />
                {mode !== "reset" && (
                  <Input
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-secondary/50 border-primary/30 focus:border-primary font-crimson"
                    required
                    minLength={6}
                  />
                )}
                <Button type="submit" disabled={loading} className="w-full font-cinzel bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30 hover:border-primary/60 transition-all">
                  {loading ? "..." : mode === "reset" ? "Envoyer le lien" : "Se connecter"}
                </Button>
              </form>

              <div className="mt-6 pt-4 border-t border-primary/15 space-y-2">
                {mode === "login" && (
                  <button onClick={() => setMode("reset")} className="text-sm text-primary/50 hover:text-primary font-crimson w-full text-center block transition-colors">
                    Mot de passe oublié ?
                  </button>
                )}
                {mode === "reset" && (
                  <button onClick={() => setMode("login")} className="text-sm text-primary/50 hover:text-primary font-crimson w-full text-center block transition-colors">
                    Retour à la connexion
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </Layout>
  );
};

export default AdminLoginPage;
