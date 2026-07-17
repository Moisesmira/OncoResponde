import OncoBox from './OncoBox';
import { ONCORESPONDE_BASE_CONTEXT } from '../context/systemPrompt';
import { wellnessPrompts, type WellnessContextId } from '../context/wellnessPrompts';

export type ContextChatProps = {
  contextId: WellnessContextId;
  initialQuestion?: string;
  title?: string;
  buttonLabel?: string;
};

export default function ContextChat({
  contextId,
  initialQuestion = '',
  title,
  buttonLabel = 'Preguntar a OncoResponde',
}: ContextChatProps) {
  const prompt = wellnessPrompts[contextId];

  return (
    <OncoBox
      contextId={prompt.id}
      context={`${ONCORESPONDE_BASE_CONTEXT} Tema actual: ${prompt.clientContext}`}
      initialQuestion={initialQuestion}
      title={title ?? `Preguntar sobre ${prompt.label.toLowerCase()}`}
      buttonLabel={buttonLabel}
    />
  );
}
