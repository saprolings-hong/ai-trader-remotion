import { Composition, Still } from "remotion";
import { myCompSchema, PreviewCard } from "./PreviewCard";
import { AiEngine } from "./AiEngine";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Still
        id="PreviewCard"
        component={PreviewCard}
        width={1200}
        height={627}
        schema={myCompSchema}
        defaultProps={{
          title: "Welcome to Remotion" as const,
          description: "Edit Video.tsx to change template" as const,
          color: "#0B84F3" as const,
        }}
      />
      <Composition
        id="AiEngine"
        component={AiEngine}
        durationInFrames={180}
        fps={30}
        width={1600}
        height={820}
      />
    </>
  );
};
