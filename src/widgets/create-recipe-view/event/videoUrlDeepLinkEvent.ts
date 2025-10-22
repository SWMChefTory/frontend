let event: { url: string } | null = null;

export const publishOpenCreatingView = ({ videoId }: { videoId: string }) => {
  event = { url: "https://www.youtube.com/watch?v=" + videoId };
};

export const subcribeOpenCreatingView = () => {
  const eventPublished = { url: event?.url || "" };
  event = null;
  return eventPublished;
};
