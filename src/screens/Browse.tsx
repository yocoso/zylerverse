import { Navigate, useParams } from "react-router-dom";
import { getCategories, getQuestionsByCollection } from "../data";
import { getCollection } from "../data/collections";
import AppBar from "../components/AppBar";
import QuestionBrowser from "../components/QuestionBrowser";

const ACCENT: Record<string, string> = {
  social: "text-social",
  family: "text-family",
  brand: "text-brand-600"
};

export default function Browse() {
  const { collectionId = "" } = useParams();
  const collection = getCollection(collectionId);
  if (!collection) return <Navigate to="/" replace />;

  const questions = getQuestionsByCollection(collectionId);
  const categories = getCategories(collectionId);

  return (
    <div className="min-h-full">
      <AppBar title={`Browse ${collection.name}`} subtitle={`${questions.length} questions`} backTo="/" />
      <QuestionBrowser
        questions={questions}
        categories={categories}
        accentClass={ACCENT[collection.accent]}
      />
    </div>
  );
}
