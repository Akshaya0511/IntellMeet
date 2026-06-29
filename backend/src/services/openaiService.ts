import { HfInference } from "@huggingface/inference";

const hf = new HfInference(
    process.env.HF_API_KEY
);

export const generateMeetingSummary = async (
    transcript: string) => {

    const result = 
     await hf.summarization({
        model: "facebook/bart-large-cnn",
        inputs: transcript,
     });

    return{ 
        summary: result.summary_text,
        actionItems: transcript
        .split(".")
        .map((item) => item.trim())
        .filter(
            (item) => 
             item.toLowerCase().includes("will")
      ),
    };
};
   
   

  