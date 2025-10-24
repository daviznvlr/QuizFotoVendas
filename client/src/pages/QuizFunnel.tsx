import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { LandingScreen } from "@/components/quiz/LandingScreen";
import { QuestionScreen, QuestionOption } from "@/components/quiz/QuestionScreen";
import { InfoScreen } from "@/components/quiz/InfoScreen";
import { ResultsScreen } from "@/components/quiz/ResultsScreen";
import { AnalyzingScreen } from "@/components/quiz/AnalyzingScreen";
import { FinalOfferScreen } from "@/components/quiz/FinalOfferScreen";
import { LoadingScreen } from "@/components/quiz/LoadingScreen";
import { TestimonialsScreen } from "@/components/quiz/TestimonialsScreen";
import { PlanReadyScreen } from "@/components/quiz/PlanReadyScreen";
import { FinalCheckoutScreen } from "@/components/quiz/FinalCheckoutScreen";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { QuizState, ProfileResult } from "@shared/schema";

export default function QuizFunnel() {
  const [currentStep, setCurrentStep] = useState(0);
  const [sessionId, setSessionId] = useState<string>("");
  const [quizState, setQuizState] = useState<QuizState>({
    currentStep: 0,
  });
  const [calculatedProfile, setCalculatedProfile] = useState<ProfileResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const { toast } = useToast();

  // Initialize session on mount
  useEffect(() => {
    const initSession = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/quiz-session", { method: "POST" });
        const data = await response.json();
        setSessionId(data.sessionId);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível iniciar a sessão. Por favor, recarregue a página.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    initSession();
  }, [toast]);

  // Mutation to save quiz responses
  const saveResponseMutation = useMutation({
    mutationFn: async (data: Partial<QuizState>) => {
      return apiRequest("POST", "/api/quiz-responses", {
        sessionId,
        ...data,
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível salvar sua resposta. Tente novamente.",
      });
    },
  });

  const updateQuizState = async (updates: Partial<QuizState>) => {
    // Wait for sessionId to be initialized
    let waitTime = 0;
    while (!sessionId && waitTime < 5000) {
      await new Promise(resolve => setTimeout(resolve, 100));
      waitTime += 100;
    }

    if (!sessionId || sessionId.trim() === '') {
      toast({
        title: "Erro",
        description: "Não foi possível iniciar a sessão. Por favor, recarregue a página.",
        variant: "destructive",
      });
      throw new Error("Session not initialized");
    }

    setQuizState((prev) => ({ ...prev, ...updates }));
    
    // Save to backend with valid sessionId
    await saveResponseMutation.mutateAsync(updates);
  };

  const simulateLoading = (callback: () => void, duration = 2000) => {
    setIsLoading(true);
    setLoadingProgress(0);
    
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsLoading(false);
            callback();
          }, 300);
          return 100;
        }
        return prev + 5;
      });
    }, duration / 20);
  };

  const goToNextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const goToPrevStep = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleStart = () => {
    goToNextStep();
  };

  const handleAgeSelect = async (age: string) => {
    await updateQuizState({ age });
    goToNextStep();
  };

  const handleInfoContinue = () => {
    goToNextStep();
  };

  const handleFeelingSelect = async (feeling: string) => {
    await updateQuizState({ feeling });
    goToNextStep();
  };

  const handleRevenueSelect = async (revenueGoal: string) => {
    await updateQuizState({ revenueGoal });
    goToNextStep();
  };

  const handleExperienceSelect = async (experience: string) => {
    // Save the experience to backend
    await updateQuizState({ experience });
    
    // Navigate to analyzing screen (step 6)
    goToNextStep();
  };

  const handleProfileCalculated = (profile: ProfileResult) => {
    // Store the calculated profile
    setCalculatedProfile(profile);
    
    // Navigate to results screen (step 7)
    goToNextStep();
  };

  const handlePotentialSelect = async (potential: string) => {
    await updateQuizState({ potential });
    goToNextStep();
  };

  const handleObstacleSelect = async (obstacle: string) => {
    await updateQuizState({ obstacle });
    goToNextStep();
  };

  const handleFinancialConcernSelect = async (financialConcern: string) => {
    // Save financial concern first, then simulate loading
    await updateQuizState({ financialConcern });
    
    simulateLoading(() => {
      goToNextStep();
    }, 1500);
  };

  const handleFinalAnswer = async (finalAnswer: string) => {
    await updateQuizState({ finalAnswer });
    goToNextStep();
  };

  const handleTestimonialsContinue = () => {
    goToNextStep();
  };

  // Auto-start loading animation when reaching step 12
  useEffect(() => {
    if (currentStep === 12) {
      simulateLoading(() => {
        goToNextStep();
      }, 2500);
    }
  }, [currentStep]);

  const handlePlanReadyContinue = () => {
    goToNextStep();
  };

  const handleCheckout = async () => {
    toast({
      title: "Obrigado!",
      description: "Você será redirecionado para finalizar sua compra.",
    });
    
    console.log("Quiz completo - Checkout:", { ...quizState, sessionId });
  };

  const ageOptions: QuestionOption[] = [
    { id: "18-29", label: "18-29" },
    { id: "30-40", label: "30-40" },
    { id: "41-50", label: "41-50" },
    { id: "+50", label: "+50" },
  ];

  const feelingOptions: QuestionOption[] = [
    { id: "realizada", label: "😍 Realizada(o) por transformar algo que gosto em renda", icon: "Heart" },
    { id: "orgulhosa", label: "😊 Orgulhosa(o) de mostrar que consigo empreender", icon: "Smile" },
    { id: "feliz", label: "🤑 Feliz por ter um dinheiro a mais no fim do ano", icon: "DollarSign" },
    { id: "motivada", label: "😉 Motivada(o) a continuar vendendo o ano todo", icon: "Zap" },
  ];

  const revenueOptions: QuestionOption[] = [
    { id: "ate-2000", label: "💰 Até R$2.000,00", icon: "TrendingUp" },
    { id: "2000-5000", label: "💵 Entre R$2.000,00 e R$ 5.000,00", icon: "TrendingUp" },
    { id: "mais-5000", label: "🤑 Mais de R$5.000,00", icon: "TrendingUp" },
    { id: "nao-pensei", label: "🤔 Ainda não pensei nisso, mas adoraria ter um lucro extra", icon: "HelpCircle" },
  ];

  const experienceOptions: QuestionOption[] = [
    { id: "nenhum", label: "🙂 Nenhum, mas adoro aprender coisas novas.", icon: "BookOpen" },
    { id: "vez-quando", label: "😐 Já faço doces de vez em quando", icon: "Coffee" },
    { id: "experiencia", label: "😍 Tenho experiência e quero dominar os panetones gourmet", icon: "Award" },
  ];

  const obstacleOptions: QuestionOption[] = [
    { id: "tempo", label: "⏰ Falta de tempo", icon: "Clock" },
    { id: "medo", label: "😰 Medo de não dar certo", icon: "AlertCircle" },
    { id: "dinheiro", label: "💸 Falta de dinheiro para investir", icon: "Wallet" },
    { id: "nao-sei", label: "🤷 Não sei por onde começar", icon: "HelpCircle" },
  ];

  const financialOptions: QuestionOption[] = [
    { id: "vida-melhor", label: "😔 Não conseguir dar uma vida melhor para a minha família", icon: "Home" },
    { id: "escolher", label: "😞 Ter que escolher entre pagar contas ou realizar sonhos", icon: "Scale" },
    { id: "tempo-filhos", label: "😢 Não ter tempo para os filhos, pois tenho que trabalhar fora", icon: "Users" },
    { id: "estressada", label: "😰 Viver estressada(o) sem segurança financeira", icon: "AlertTriangle" },
  ];

  if (isLoading) {
    return <LoadingScreen progress={loadingProgress} />;
  }

  return (
    <>
      {currentStep === 0 && <LandingScreen onStart={handleStart} />}
      
      {currentStep === 1 && (
        <QuestionScreen
          question="Qual a sua idade?"
          options={ageOptions}
          onSelect={handleAgeSelect}
          onBack={goToPrevStep}
          selectedValue={quizState.age}
        />
      )}

      {currentStep === 2 && (
        <InfoScreen onContinue={handleInfoContinue} onBack={goToPrevStep} />
      )}

      {currentStep === 3 && (
        <QuestionScreen
          question="Como se sentiria se conseguisse fazer e vender panetones neste fim de ano?"
          options={feelingOptions}
          onSelect={handleFeelingSelect}
          onBack={goToPrevStep}
          selectedValue={quizState.feeling}
        />
      )}

      {currentStep === 4 && (
        <QuestionScreen
          question="Quanto você gostaria de faturar com panetones neste Natal?"
          options={revenueOptions}
          onSelect={handleRevenueSelect}
          onBack={goToPrevStep}
          selectedValue={quizState.revenueGoal}
        />
      )}

      {currentStep === 5 && (
        <QuestionScreen
          question="Qual é o seu nível de experiência na cozinha?"
          options={experienceOptions}
          onSelect={handleExperienceSelect}
          onBack={goToPrevStep}
          selectedValue={quizState.experience}
        />
      )}

      {currentStep === 6 && (
        <AnalyzingScreen
          sessionId={sessionId}
          onComplete={handleProfileCalculated}
          onBack={goToPrevStep}
        />
      )}

      {currentStep === 7 && calculatedProfile && (
        <ResultsScreen
          profile={calculatedProfile}
          onContinue={handlePotentialSelect}
          onBack={goToPrevStep}
        />
      )}

      {currentStep === 8 && (
        <QuestionScreen
          question="O que mais te impede de começar algo novo para ganhar uma renda extra?"
          options={obstacleOptions}
          onSelect={handleObstacleSelect}
          onBack={goToPrevStep}
          selectedValue={quizState.obstacle}
        />
      )}

      {currentStep === 9 && (
        <QuestionScreen
          question="O que mais te preocupa na sua situação financeira atual?"
          options={financialOptions}
          onSelect={handleFinancialConcernSelect}
          onBack={goToPrevStep}
          selectedValue={quizState.financialConcern}
        />
      )}

      {currentStep === 10 && (
        <FinalOfferScreen
          onAccept={() => handleFinalAnswer("sim")}
          onLearnMore={() => handleFinalAnswer("saber-mais")}
          onBack={goToPrevStep}
        />
      )}

      {currentStep === 11 && (
        <TestimonialsScreen
          onContinue={handleTestimonialsContinue}
          onBack={goToPrevStep}
        />
      )}

      {currentStep === 12 && (
        <LoadingScreen 
          progress={loadingProgress} 
          message="Aguarde... Saindo um plano especial do forno para você"
        />
      )}

      {currentStep === 13 && (
        <PlanReadyScreen
          onContinue={handlePlanReadyContinue}
          onBack={goToPrevStep}
        />
      )}

      {currentStep === 14 && (
        <FinalCheckoutScreen
          onCheckout={handleCheckout}
          onBack={goToPrevStep}
        />
      )}
    </>
  );
}
