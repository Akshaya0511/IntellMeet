import { Request, Response } from "express";
import Meeting from "../models/Meeting";
import { v4 as uuidv4 } from "uuid";

// CREATE MEETING
export const createMeeting = async (req: any, res: Response) => {
  try {
    const meeting = await Meeting.create({
      title: req.body.title,
      host: req.user.id,
      meetingId: uuidv4().substring(0, 8).toUpperCase(),
      participants: [],
    });

    res.status(201).json(meeting);
  } catch (err) {
    console.error(err);

    res.status(500).json({ message: "Error creating meeting" });
  }
};

//updata meeting
export const updateMeeting = async (
  req: Request,
  res: Response ) => {
    const meeting = await Meeting.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(meeting);
  };


// GET ALL MEETINGS
export const getMeetings = async (req: Request, res: Response) => {
  try {
    const meetings = await Meeting.find().populate("host", "name email");

    console.log("Meetings:", meetings);
    res.json(meetings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching meetings" });
  }
};

// GET BY CODE (JOIN MEETING)
export const getMeetingByCode = async (req: Request, res: Response) => {
  try {
    const meeting = await Meeting.findOne({
      meetingId: req.params.code,
    });

    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    res.json(meeting);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching meeting" });
  }
};

// DELETE MEETING
export const deleteMeeting = async (req: Request, res: Response) => {
  try {
    await Meeting.findByIdAndDelete(req.params.id);
    res.json({ message: "Meeting deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting meeting" });
  }
};

export const generateSummary = async (
  req: Request,
  res: Response
) => {
  try {

    console.log("GENERATE SUMMARY HIT");
    
    const { meetingId, transcript } = req.body;

    const meeting = await Meeting.findById(meetingId);

    if (!meeting) {
      return res.status(404).json({
        message: "Meeting not found",
      });
    }

    // Temporary AI Logic
    const summary = 
    transcript.length > 100
     ? transcript.substring(0, 100) + "..."
     : transcript;

     console.log("TRANSCRIPT:", transcript);

     const actionItems = transcript
      .split(".")
      .map((item: string) => item.trim())
      .filter(
       (item: string) => 
        item.toLowerCase().includes("will")
     );

     meeting.transcript = transcript;
     meeting.summary =  summary;
     meeting.actionItems = actionItems;

     await meeting.save();

     res.json({
      summary,
      transcript,
      actionItems,
     });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error generating summary",
    });
  }
};