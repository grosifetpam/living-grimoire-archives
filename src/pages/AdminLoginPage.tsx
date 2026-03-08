import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AdminLoginPage = () => {
  const [mode, setMode] = useState<"login" | "signup" | "reset">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
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

    const { error } = mode === "signup" ? await signUp(email, password) : await signIn(email, password);

    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else if (mode === "signup") {
      toast({ title: "Inscription réussie", description: "Vérifiez votre email pour confirmer votre compte." });
    } else {
      navigate("/admin");
    }
    setLoading(false);
  };

  const title = mode === "reset" ? "Réinitialiser le mot de passe" : mode === "signup" ? "Inscription Admin" : "Connexion Admin";
  const subtitle = mode === "reset" ? "Entrez votre email pour recevoir un lien de réinitialisation" : mode === "signup" ? "Créez votre compte administrateur" : "Accédez aux archives secrètes";

  return (
    <Layout>
      <section className="min-h-screen flex items-center justify-center px-4">
        <div className="grimoire-card p-8 w-full max-w-md">
          <h1 className="font-cinzel text-3xl font-bold text-primary text-glow-gold text-center mb-2">
            {title}
          </h1>
          <p className="text-center text-muted-foreground font-crimson mb-8">
            {subtitle}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-secondary/50 border-primary/30 focus:border-primary"
              required
            />
            {mode !== "reset" && (
              <Input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-secondary/50 border-primary/30 focus:border-primary"
                required
                minLength={6}
              />
            )}
            <Button type="submit" disabled={loading} className="w-full shimmer-btn font-cinzel">
              {loading ? "..." : mode === "reset" ? "Envoyer le lien" : mode === "signup" ? "S'inscrire" : "Se connecter"}
            </Button>
          </form>

          <div className="mt-4 space-y-2">
            {mode === "login" && (
              <>
                <button
                  onClick={() => setMode("reset")}
                  className="text-sm text-primary/60 hover:text-primary font-crimson w-full text-center block"
                >
                  Mot de passe oublié ?
                </button>
                <button
                  onClick={() => setMode("signup")}
                  className="text-sm text-primary/60 hover:text-primary font-crimson w-full text-center block"
                >
                  Pas de compte ? S'inscrire
                </button>
              </>
            )}
            {mode === "signup" && (
              <button
                onClick={() => setMode("login")}
                className="text-sm text-primary/60 hover:text-primary font-crimson w-full text-center block"
              >
                Déjà un compte ? Se connecter
              </button>
            )}
            {mode === "reset" && (
              <button
                onClick={() => setMode("login")}
                className="text-sm text-primary/60 hover:text-primary font-crimson w-full text-center block"
              >
                Retour à la connexion
              </button>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AdminLoginPage;
