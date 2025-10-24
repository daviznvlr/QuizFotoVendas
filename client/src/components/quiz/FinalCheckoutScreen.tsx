import { useState, useEffect } from "react";
import { ArrowLeft, Clock, Frown, Smile, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import beforeImage from "@assets/image_1760984396828.png";
import afterImage from "@assets/SaveClip.App_566401362_18340939615203749_2169125330666957429_n_1761268003418.jpg";

interface FinalCheckoutScreenProps {
  onCheckout: () => void;
  onBack?: () => void;
}

export function FinalCheckoutScreen({ onCheckout, onBack }: FinalCheckoutScreenProps) {
  const [timeLeft, setTimeLeft] = useState(480);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="bg-yellow-300 text-center py-3 px-6">
        <p className="text-sm font-semibold text-foreground flex items-center justify-center gap-2" data-testid="text-timer">
          <Clock className="w-4 h-4" />
          {formatTime(timeLeft)} Oferta por tempo limitado!
        </p>
      </div>

      <div className="w-full max-w-2xl mx-auto px-6 py-8 flex-1 flex flex-col">
        {onBack && (
          <button
            onClick={onBack}
            className="mb-6 inline-flex items-center gap-2 text-muted-foreground hover-elevate active-elevate-2 p-2 rounded-md transition-colors self-start"
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}

        <div className="flex-1 flex flex-col items-center justify-center space-y-8">
          <div className="w-full grid grid-cols-2 gap-4">
            <Card className="bg-card" data-testid="card-before">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-center font-bold text-foreground" data-testid="text-before-title">
                  ANTES
                </h3>
                <div className="aspect-square bg-muted rounded-md flex items-center justify-center overflow-hidden">
                  <img 
                    src={beforeImage} 
                    alt="Antes" 
                    className="w-full h-full object-cover grayscale"
                  />
                </div>
                <p className="text-center text-sm text-foreground" data-testid="text-before-desc">
                  Você deixando passar mais uma oportunidade de renda extra
                </p>
                <div className="flex items-center gap-2 text-muted-foreground text-sm justify-center">
                  <div className="flex-1 h-2 bg-muted rounded-full">
                    <div className="h-full w-1/4 bg-muted-foreground rounded-full"></div>
                  </div>
                  <Frown className="w-4 h-4" />
                </div>
                <p className="text-center text-xs text-muted-foreground" data-testid="text-before-footer">
                  Vai ficar na mesma situação...
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-green-500 border-2" data-testid="card-after">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-center font-bold text-foreground" data-testid="text-after-title">
                  DEPOIS
                </h3>
                <div className="aspect-square bg-muted rounded-md flex items-center justify-center overflow-hidden">
                  <img 
                    src={afterImage} 
                    alt="Depois" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-center text-sm text-foreground" data-testid="text-after-desc">
                  Você estará preparada e faturando alto com panetones gourmet
                </p>
                <div className="flex items-center gap-2 text-green-600 text-sm justify-center">
                  <div className="flex-1 h-2 bg-muted rounded-full">
                    <div className="h-full w-full bg-green-500 rounded-full"></div>
                  </div>
                  <Smile className="w-4 h-4" />
                </div>
                <p className="text-center text-xs text-green-600 font-medium" data-testid="text-after-footer">
                  Depois que você disser sim a essa oportunidade!
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-foreground" data-testid="text-offer-title">
              Oferta exclusiva válida só hoje
            </h2>
          </div>

          <Card className="w-full max-w-md bg-card border-2" data-testid="card-offer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full border-2 border-foreground flex items-center justify-center">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground line-through" data-testid="text-price-old">
                      De R$97,00
                    </p>
                  </div>
                </div>
                <div className="bg-yellow-300 px-6 py-3 rounded-md">
                  <p className="text-xs text-foreground">Por apenas</p>
                  <p className="text-3xl font-bold text-green-600" data-testid="text-price-new">
                    R$ 19,90
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            asChild
            size="lg"
            className="w-full max-w-md bg-success hover:bg-success/90 text-success-foreground animate-pulse-cta"
            data-testid="button-checkout"
          >
            <a href="https://pay.kiwify.com.br/gDLcgEB" target="_blank" rel="noopener noreferrer">
              COMPRAR AGORA
            </a>
          </Button>

          <div className="w-full max-w-md space-y-4 mt-4">
            <p className="text-center text-sm text-muted-foreground" data-testid="text-payment-info">
              Pague seu investimento com apenas 01 panetone
            </p>

            <Card className="bg-card">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full border-2 border-foreground flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <h3 className="text-center font-bold text-lg text-foreground" data-testid="text-guarantee-title">
                  Seu risco é zero!
                </h3>
                <p className="text-center text-sm text-foreground" data-testid="text-guarantee-desc">
                  Se dentro de 7 dias você não estiver satisfeito com o material oferecido, garantimos 100% do seu dinheiro de volta.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
