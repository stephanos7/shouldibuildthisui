import { Box, Stack } from '@mui/material';

export type SectionProgressSegmentsProps = {
  sectionIndex: number;
  sectionCount: number;
  completedSectionIndexes: number[];
};

function getSegmentLabel(
  index: number,
  sectionCount: number,
  sectionIndex: number,
  completedSectionIndexes: number[]
) {
  const isCurrent = index === sectionIndex;
  const isComplete = completedSectionIndexes.includes(index);

  return `Section ${index + 1} of ${sectionCount}${
    isCurrent ? ', current section' : isComplete ? ', completed' : ''
  }`;
}

export default function SectionProgressSegments({
  sectionIndex,
  sectionCount,
  completedSectionIndexes
}: SectionProgressSegmentsProps) {
  return (
    <Stack
      direction="row"
      spacing={0.75}
      role="list"
      aria-label="Assessment section progress"
    >
      {Array.from({ length: sectionCount }).map((_, index) => {
        const isCurrent = index === sectionIndex;
        const isComplete = completedSectionIndexes.includes(index);

        return (
          <Box
            key={index}
            role="listitem"
            aria-label={getSegmentLabel(index, sectionCount, sectionIndex, completedSectionIndexes)}
            sx={{
              flex: 1,
              minWidth: 0,
              height: 6,
              borderRadius: 999,
              bgcolor: isCurrent
                ? 'primary.main'
                : isComplete
                  ? 'primary.light'
                  : 'action.hover'
            }}
          />
        );
      })}
    </Stack>
  );
}
