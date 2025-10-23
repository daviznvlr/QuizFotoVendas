import { ArrowLeft, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";
import panettone1 from "@assets/image_1761261479388.png";
import panettone2 from "@assets/image_1761261494539.png";
import panettone3 from "@assets/image_1761261527264.png";
import panettone4 from "@assets/image_1761261560092.png";

interface PlanReadyScreenProps {
  onContinue: () => void;
  onBack?: () => void;
}

interface Benefit {
  title: string;
  description: string;
}

const benefits: Benefit[] = [
  {
    title: "35 Receitas exclusivas de Panetones Gourmet:",
    description: "aprenda a fazer panetones deliciosos que vão encantar seus clientes e aumentar suas vendas"
  },
  {
    title: "Precificação para o lucro:",
    description: "aprenda a dar o preço correto em cada tipo de panetone e aumente a sua margem de lucro"
  },
  {
    title: "Estratégias de divulgação simples e eficazes:",
    description: "como promover seus panetones no whatsapp, facebook e instagram de forma prática e atrair clientes prontos para comprar"
  },
  {
    title: "Baixo investimento inicial:",
    description: "como começar o seu negócio de panetones gourmet sem gastar muito, utilizando ingredientes acessíveis e técnicas que garantem alto lucro"
  }
];

const panettoneImages = [panettone1, panettone2, panettone3, panettone4];

export function PlanReadyScreen({ onContinue, onBack }: PlanReadyScreenProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
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
          <div className="w-full max-w-md relative">
            <div className="overflow-hidden rounded-lg" ref={emblaRef}>
              <div className="flex">
                {panettoneImages.map((image, index) => (
                  <div key={index} className="flex-[0_0_100%] min-w-0">
                    <img
                      src={image}
                      alt={`Panetone Gourmet ${index + 1}`}
                      className="w-full h-auto rounded-lg"
                      data-testid={`img-carousel-${index}`}
                    />
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={scrollPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover-elevate active-elevate-2"
              data-testid="button-carousel-prev"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover-elevate active-elevate-2"
              data-testid="button-carousel-next"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground" data-testid="text-title">
              Seu plano está pronto!!!
            </h1>
            <p className="text-lg text-destructive font-semibold" data-testid="text-subtitle">
              Veja o que você irá aprender e ter acesso:
            </p>
          </div>

          <div className="w-full space-y-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex gap-3" data-testid={`benefit-${index}`}>
                <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-foreground">
                    <span className="font-semibold">{benefit.title}</span>{" "}
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Button
            onClick={onContinue}
            size="lg"
            className="w-full max-w-md bg-success hover:bg-success/90 text-success-foreground animate-pulse-cta"
            data-testid="button-continue"
          >
            CONTINUAR
          </Button>
        </div>
      </div>
    </div>
  );
}
