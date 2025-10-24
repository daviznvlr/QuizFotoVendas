import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Logo } from "./Logo";
import { ProgressBar } from "./ProgressBar";
import { Button } from "@/components/ui/button";
import type { ProfileResult } from "@shared/schema";

interface AnalyzingScreenProps {
  sessionId: string;
  onComplete: (profile: ProfileResult) => void;
  onBack?: () => void;
}

export function AnalyzingScreen({ sessionId, onComplete, onBack }: AnalyzingScreenProps) {
  const { data: profile, error, refetch } = useQuery<ProfileResult>({
    queryKey: [`/api/profile/${sessionId}`],
    enabled: !!sessionId,
    retry: 3,
    retryDelay: 1000,
    staleTime: 0,
  });

  useEffect(() => {
    if (profile) {
      // Profile loaded successfully, navigate to results
      onComplete(profile);
    } else if (!sessionId) {
      // No session, use default profile
      const defaultProfile: ProfileResult = {
        potential: "Alto",
        score: 85,
        insights: [
          "Você tem grande potencial para ganhar dinheiro extra vendendo panetones gourmet este Natal!",
          "Sua disposição para aprender coisas novas é um diferencial importante",
          "O mercado de panetones gourmet está em crescimento"
        ]
      };
      setTimeout(() => onComplete(defaultProfile), 2000);
    }
  }, [profile, onComplete, sessionId]);

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-md space-y-6">
          <Logo />
          <div className="text-center space-y-4">
            <p className="text-lg font-medium text-destructive">
              Erro ao calcular seu perfil. Por favor, tente novamente.
            </p>
            <Button
              onClick={() => refetch()}
              size="lg"
              className="w-full h-14 text-lg font-semibold"
              data-testid="button-retry-analyzing"
            >
              Tentar Novamente
            </Button>
            {onBack && (
              <Button
                onClick={onBack}
                variant="outline"
                size="lg"
                className="w-full"
                data-testid="button-back-from-analyzing"
              >
                Voltar
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md space-y-8">
        <Logo />
        <div className="text-center space-y-4">
          <ProgressBar progress={77} />
        </div>
      </div>
    </div>
  );
}
