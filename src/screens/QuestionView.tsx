import { Navigate, useParams } from "react-router-dom";
import { getQuestionById } from "../data";
import { getCollection } from "../data/collections";
import AppBar from "../components/AppBar";
import QuestionDetail from "../components/QuestionDetail";

export default function QuestionView() {
  const { collectionId = "", questionId = "" } = useParams();
  const question = getQuestionById(questionId);
  const collection = getCollection(collectionId);

  // Guard against stale deep links (e.g. a question id removed in an update).
  if (!question || !collection || question.collectionId !== collectionId) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-full pb-10">
      <AppBar
        title={collection.name}
        subtitle="Read together, then talk it through"
        backTo="/"
      />
      {/* key forces a remount per question so the guide resets to hidden. */}
      <QuestionDetail key={question.id} question={question} />
    </div>
  );
}
