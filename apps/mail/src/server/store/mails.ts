import { create } from "zustand";
import type { SafeParsedMail } from "../imap/mail/upload.js";

type State = {
	mails: SafeParsedMail[];
};

type Actions = {
	push: (mail: SafeParsedMail) => void;
};

export const useMailStore = create<State & Actions>((set) => ({
	mails: [],
	push: (mail) => set((curr) => ({ mails: [...curr.mails, mail] })),
}));
