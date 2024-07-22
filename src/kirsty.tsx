import { Form, ActionPanel, Action, showToast, getPreferenceValues, LocalStorage } from "@raycast/api";
import axios from "axios";
import { useState } from "react";
import ShowSavedTrelloLinks from "./show-links";

type Values = {
  cardTitle: string;
  cardDescription: string;
};

interface Preferences {
  apiKey: string;
  apiToken: string;
  listIdKirsty: string;
  userIdKirsty: string;
  userIdAnu: string;
}

interface CardLink {
  url: string;
  title: string;
  command: string;
}

const preferences = getPreferenceValues<Preferences>();

const TRELLO_KEY = preferences.apiKey;
const TRELLO_TOKEN = preferences.apiToken;
const TRELLO_LIST_ID = preferences.listIdKirsty;
const TRELLO_MEMBERS = `${preferences.userIdKirsty},${preferences.userIdAnu}`;

export default function Command() {
  const [cardUrl, setCardUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(values: Values) {
    setIsLoading(true);

    const cardData = {
      name: values.cardTitle,
      desc: values.cardDescription,
      idList: TRELLO_LIST_ID,
      idMembers: TRELLO_MEMBERS.split(","),
      key: TRELLO_KEY,
      token: TRELLO_TOKEN,
    };

    console.log("Request Data:", cardData); // Log the request data

    try {
      const response = await axios.post(`https://api.trello.com/1/cards`, null, {
        params: cardData,
      });
      if (response.status === 200 || response.status === 201) {
        const newCardId = response.data.id;
        const url = `trello://trello.com/c/${newCardId}`;
        setCardUrl(url);

        // Save the card link, title, and command to local storage
        const savedLinksString = await LocalStorage.getItem<string>("trello_card_links");
        const savedLinks: CardLink[] = savedLinksString ? JSON.parse(savedLinksString) : [];
        savedLinks.push({ url, title: values.cardTitle, command: "Kirsty" });
        await LocalStorage.setItem("trello_card_links", JSON.stringify(savedLinks));

        showToast({ title: "Card Created", message: "Successfully created Trello card" });
      } else {
        showToast({ title: "Error", message: `Failed to create card. HTTP Status Code: ${response.status}` });
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Error Response:", error.response?.data); // Log detailed error response
        showToast({ title: "Error", message: `Failed to create card: ${error.message}` });
      } else {
        console.error("Unknown Error:", error);
        showToast({ title: "Error", message: "An unexpected error occurred" });
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={handleSubmit} />
          {cardUrl && <Action.OpenInBrowser title="Open Trello Card" url={cardUrl} />}
          <Action.Push title="Show Saved Trello Links" target={<ShowSavedTrelloLinks />} />
        </ActionPanel>
      }
    >
      <Form.Description text="Let's create a Trello Card for Kirsty in the Sauers Board." />
      <Form.TextField id="cardTitle" title="Card Title" placeholder="Enter the card title" />
      <Form.TextArea id="cardDescription" title="Card Description" placeholder="Enter the card description" />
    </Form>
  );
}
