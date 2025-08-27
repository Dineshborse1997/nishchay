import { useParams } from "react-router-dom";
import QuizInterface from "@/components/student/QuizInterface";

const QuizPage = () => {
  const params = useParams();
  const { examType, section, year } = params;
  
  console.log('QuizPage params:', params);
  console.log('Current path:', window.location.pathname);
  
  // Determine section based on the route
  let actualSection = section;
  if (window.location.pathname.includes('/pyq/')) {
    actualSection = 'pyq';
  } else if (window.location.pathname.includes('/model_papers/')) {
    actualSection = 'model_papers';
  }
  
  // For model papers, the third parameter is set number, not year
  const isModelPaper = actualSection === 'model_papers';
  const setOrYear = year;
  
  console.log('Final params:', { examType, section: actualSection, setOrYear, isModelPaper });
  
  return <QuizInterface examType={examType} section={actualSection} year={year} />;
};

export default QuizPage;