import AIAnalysisSection from "./AIAnalysisSection";
// import RecommendationsSection from "./RecommendationsSection";

function AIInsights({
    insight,
    // recommendations,
    showAnalysis = true,
    // showRecommendations = true
}) {
    return (
        <AIAnalysisSection insight={insight} />
    );
}

export default AIInsights;
