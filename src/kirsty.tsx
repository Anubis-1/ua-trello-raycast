import { Form, ActionPanel, Action, showToast, getPreferenceValues } from "@raycast/api";
import axios from "axios";

type Values = {
  cardTitle: string;
  cardDescription: string;
};

interface Preferences {
  apiKey: string;
  apiToken: string;
  boardIdKirsty: string;
  userIdKirsty: string;
  UserIdAnu: string;
}

const preferences = getPreferenceValues<Preferences>();

const TRELLO_KEY = preferences.apiKey;
const TRELLO_TOKEN = preferences.apiToken;
const TRELLO_LIST_ID = preferences.boardIdKirsty;
const TRELLO_MEMBERS = `${preferences.userIdKirsty},${preferences.UserIdAnu}`;

export default function Command() {
  async function handleSubmit(values: Values) {
    const cardData = {
      name: values.cardTitle,
      desc: values.cardDescription,
      idList: TRELLO_LIST_ID,
      idMembers: TRELLO_MEMBERS.split(","),
      key: TRELLO_KEY,
      token: TRELLO_TOKEN,
    };

    console.log("Request Data:", cardData);  // Log the request data

    try {
      const response = await axios.post(`https://api.trello.com/1/cards`, null, {
        params: cardData,
      });
      if (response.status === 200 || response.status === 201) {
        showToast({ title: "Card Created", message: "Successfully created Trello card" });
      } else {
        showToast({ title: "Error", message: `Failed to create card. HTTP Status Code: ${response.status}` });
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Error Response:", error.response?.data);  // Log detailed error response
        showToast({ title: "Error", message: `Failed to create card: ${error.message}` });
      } else {
        console.error("Unknown Error:", error);
        showToast({ title: "Error", message: "An unexpected error occurred" });
      }
    }
  }

  return (
    <Form
      actions={
        <ActionPanel>
        <Action.SubmitForm onSubmit={handleSubmit} />
      </ActionPanel>
      }
    >
      <Form.Description text="Let's create a Trello Card for Kirsty in the Sauers Board." />
      <Form.TextField id="cardTitle" title="Card Title" placeholder="Enter the card title" />
      <Form.TextArea id="cardDescription" title="Card Description" placeholder="Enter the card description" />
    </Form>
  );
}