import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

const AdminLoginPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setLoading(true);

    const { error } = isSignUp ? await signUp(email, password) : await signIn(email, password);

    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else if (isSignUp) {
      toast({ title: "Inscription réussie", description: "Vérifiez votre email pour confirmer votre compte." });
    } else {
      navigate("/admin");
    }
    setLoading(false);
  };

  return (
    <Layout>
      <section className="min-h-screen flex items-center justify-center px-4">
        <div className="grimoire-card p-8 w-full max-w-md">
          <h1 className="font-cinzel text-3xl font-bold text-primary text-glow-gold text-center mb-2">
            {isSignUp ? "Inscription Admin" : "Connexion Admin"}
          </h1>
          <p className="text-center text-muted-foreground font-crimson mb-8">
            {isSignUp ? "Créez votre compte administrateur" : "Accédez aux archives secrètes"}
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
            <Input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-secondary/50 border-primary/30 focus:border-primary"
              required
              minLength={6}
            />
            <Button type="submit" disabled={loading} className="w-full shimmer-btn font-cinzel">
              {loading ? "..." : isSignUp ? "S'inscrire" : "Se connecter"}
            </Button>
          </form>

          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="mt-4 text-sm text-primary/60 hover:text-primary font-crimson w-full text-center"
          >
            {isSignUp ? "Déjà un compte ? Se connecter" : "Pas de compte ? S'inscrire"}
          </button>
        </div>
      </section>
    </Layout>
  );
};

export default AdminLoginPage;
