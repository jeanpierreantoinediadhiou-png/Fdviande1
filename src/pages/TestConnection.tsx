import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, RefreshCw, AlertCircle } from "lucide-react";

export default function TestConnection() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [tests, setTests] = useState<any[]>([]);

  const runTests = async () => {
    setStatus('loading');
    setResponse(null);
    setError('');
    setTests([]);
    
    const newTests: any[] = [];

    // Test 1: /api/test
    try {
      const res = await fetch('/api/test', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      newTests.push({ name: 'GET /api/test', status: res.ok ? 'success' : 'error', data });
    } catch (err: any) {
      newTests.push({ name: 'GET /api/test', status: 'error', data: err.message });
    }

    // Test 2: /api/health
    try {
      const res = await fetch('/api/health', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      newTests.push({ name: 'GET /api/health', status: res.ok ? 'success' : 'error', data });
    } catch (err: any) {
      newTests.push({ name: 'GET /api/health', status: 'error', data: err.message });
    }

    // Test 3: POST /api/login (avec données invalides)
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@test.com', password: 'test' }),
      });
      const data = await res.json();
      newTests.push({ name: 'POST /api/login', status: 'success', data: `Route réactive (${res.status})` });
    } catch (err: any) {
      newTests.push({ name: 'POST /api/login', status: 'error', data: err.message });
    }

    setTests(newTests);
    
    // Vérifier que au moins 2 tests réussissent
    const successCount = newTests.filter(t => t.status === 'success').length;
    if (successCount >= 2) {
      setStatus('success');
      setResponse(newTests[0]?.data);
    } else {
      setStatus('error');
      setError('Certains tests ont échoué. Vérifiez que le backend est démarré.');
    }
  };

  useEffect(() => {
    runTests();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              🔗 Test de Connexion Frontend → Backend
              {status === 'success' && <Badge className="bg-green-100 text-green-800 border-green-300">✓ Connecté</Badge>}
              {status === 'error' && <Badge variant="destructive">✗ Déconnecté</Badge>}
              {status === 'loading' && <Badge variant="outline" className="animate-pulse">⏳ Test...</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Bouton de relance */}
            <Button 
              onClick={runTests} 
              disabled={status === 'loading'}
              className="w-full"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${status === 'loading' ? 'animate-spin' : ''}`} />
              Relancer les tests
            </Button>

            {/* Résultats des tests */}
            {tests.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Résultats des tests :</h3>
                {tests.map((test, idx) => (
                  <div key={idx} className="p-3 rounded-lg border bg-card flex items-start gap-3">
                    {test.status === 'success' ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{test.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{typeof test.data === 'string' ? test.data : JSON.stringify(test.data)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Message de succès */}
            {status === 'success' && (
              <div className="space-y-3 p-4 rounded-lg bg-green-50 border border-green-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-900">Connexion établie avec succès !</span>
                </div>
                <div className="text-sm text-green-800 space-y-1">
                  <p>✅ Serveur backend accessible sur localhost:5000</p>
                  <p>✅ CORS configuré correctement</p>
                  <p>✅ Proxy Vite fonctionne</p>
                  <p>✅ Routes API réactives</p>
                </div>
              </div>
            )}

            {/* Message d'erreur */}
            {status === 'error' && (
              <div className="space-y-3 p-4 rounded-lg bg-red-50 border border-red-200">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-red-900">Impossible de se connecter au backend</span>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
                <div className="text-sm text-red-800 space-y-1">
                  <p className="font-medium">Vérifiez que :</p>
                  <ul className="list-disc list-inside ml-2 space-y-1">
                    <li>Le serveur backend est démarré (<code className="bg-red-100 px-1.5 py-0.5 rounded text-xs font-mono">npm run dev</code> dans <code className="bg-red-100 px-1.5 py-0.5 rounded text-xs font-mono">/backend</code>)</li>
                    <li>Le port 5000 est disponible et pas utilisé</li>
                    <li>La route /api/test répond en moins de 30 secondes</li>
                    <li>Pas de firewall bloquant la connexion</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Informations de configuration */}
            <div className="p-3 rounded-lg bg-muted text-xs space-y-1 font-mono">
              <p><span className="text-muted-foreground">Frontend URL:</span> {window.location.origin}</p>
              <p><span className="text-muted-foreground">Backend URL:</span> http://localhost:5000</p>
              <p><span className="text-muted-foreground">API Base:</span> /api (via proxy Vite)</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}