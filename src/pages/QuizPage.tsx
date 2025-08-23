import { useParams } from "react-router-dom";
import QuizInterface from "@/components/student/QuizInterface";

const QuizPage = () => {
  const { examType, section } = useParams();
  
  return <QuizInterface examType={examType} section={section} />;
};

export default QuizPage;