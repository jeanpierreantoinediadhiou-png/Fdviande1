import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { User, ShieldCheck, Mail, Lock, UserPlus, AlertCircle, Loader2 } from "lucide-react";
import { login, register } from "@/lib/api";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>, type: 'login' | 'register') => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      if (!email || !password) {
        throw new Error("Email et mot de passe sont requis");
      }

      let result;

      if (type === "login") {
        console.log("🔐 Connexion avec:", email);
        result = await login(email, password);

        if (!result.success) {
          setError(result.error || "Email ou mot de passe incorrect");
          toast.error(result.error || "Connexion échouée");
          return;
        }

        toast.success(result.message || "Connexion réussie");
        localStorage.setItem("user", JSON.stringify(result.data?.user));

        if (result.data?.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        const nom = formData.get("nom") as string;

        if (!nom) {
          throw new Error("Nom, email et mot de passe sont requis");
        }

        if (password.length < 6) {
          setError("Le mot de passe doit contenir au moins 6 caractères");
          toast.error("Le mot de passe doit contenir au moins 6 caractères");
          return;
        }

        console.log("📝 Inscription avec:", email);
        result = await register(nom, email, password);

        if (!result.success) {
          setError(result.error || "Erreur lors de l'inscription");
          toast.error(result.error || "Inscription échouée");
          return;
        }

        toast.success(result.message || "Compte créé avec succès");
        setActiveTab("login");
        (e.currentTarget as HTMLFormElement).reset();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur inconnue s'est produite";
      console.error("❌ Erreur Auth:", errorMessage);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20 p-4">
      <Card className="w-full max-w-md border-primary/20 bg-secondary/50 backdrop-blur-sm shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold font-display text-primary">Maison Viande TP</CardTitle>
          <CardDescription>Accédez à votre espace boucher</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Connexion</TabsTrigger>
              <TabsTrigger value="register">Inscription</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="animate-in fade-in zoom-in duration-300">
              <form onSubmit={(e) => handleAuth(e, "login")} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="nom@exemple.com"
                      className="pl-10"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      className="pl-10"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full h-11" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {loading ? "Connexion..." : "Se connecter"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register" className="animate-in fade-in zoom-in duration-300">
              <form onSubmit={(e) => handleAuth(e, "register")} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-nom">Nom complet</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="reg-nom"
                      name="nom"
                      placeholder="Jean Dupont"
                      className="pl-10"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="reg-email"
                      name="email"
                      type="email"
                      placeholder="nom@exemple.com"
                      className="pl-10"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">Mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="reg-password"
                      name="password"
                      type="password"
                      className="pl-10"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full h-11" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {loading ? "Création..." : "Créer un compte"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col text-center text-sm text-muted-foreground border-t pt-4 space-y-2">
          <div>
            <p className="font-medium">Compte de test (Admin)</p>
            <p>Email: jeanpierreantoinediadhiou@gmail.com</p>
            <p>MDP: antoine256</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-primary/20 bg-secondary/50 backdrop-blur-sm shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold font-display text-primary">Maison Viande TP</CardTitle>
          <CardDescription>Accédez à votre espace boucher</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Connexion</TabsTrigger>
              <TabsTrigger value="register">Inscription</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="animate-in fade-in zoom-in duration-300">
              <form onSubmit={(e) => handleAuth(e, 'login')} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="email" name="email" type="email" placeholder="nom@exemple.com" className="pl-10" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="password" name="password" type="password" className="pl-10" required />
                  </div>
                </div>
                <Button type="submit" className="w-full h-11" disabled={loading}>
                  {loading ? "Connexion..." : "Se connecter"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register" className="animate-in fade-in zoom-in duration-300">
              <form onSubmit={(e) => handleAuth(e, 'register')} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-nom">Nom complet</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="reg-nom" name="nom" placeholder="Jean Dupont" className="pl-10" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="reg-email" name="email" type="email" placeholder="nom@exemple.com" className="pl-10" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">Mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="reg-password" name="password" type="password" className="pl-10" required />
                  </div>
                </div>
                <Button type="submit" className="w-full h-11" disabled={loading}>
                  {loading ? "Création..." : "Créer un compte"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col text-center text-sm text-muted-foreground border-t pt-4">
          <p>Admin : jeanpierreantoinediadhiou@gmail.com</p>
          <p>MDP : antoine256</p>
        </CardFooter>
      </Card>
    </div>
  );
}
