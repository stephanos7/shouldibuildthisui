import HomeHero from '../home/HomeHero';

type AssessmentHeroProps = {
  hasSavedDraft: boolean;
  hasSavedResult?: boolean;
  onStart: () => void;
};

export default function AssessmentHero({
  hasSavedDraft,
  hasSavedResult,
  onStart
}: AssessmentHeroProps) {
  return (
    <HomeHero
      hasSavedDraft={hasSavedDraft}
      hasSavedResult={hasSavedResult ?? false}
      onStart={onStart}
    />
  );
}
