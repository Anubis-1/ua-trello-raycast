import { Form, ActionPanel, Action, showToast, getPreferenceValues, useNavigation } from "@raycast/api";
import axios from "axios";
import { useEffect, useState } from "react";

type Values = {
  cardTitle: string;
  cardDescription: string;
  templateCardId: string;
};

interface Preferences {
  apiKey: string;
  apiToken: string;
  boardIdArya: string;
  templatesListId: string;
  userIdArya: string;
  UserIdAnu: string;
}

interface TemplateCard {
  id: string;
  name: string;
  desc: string;
}

const preferences = getPreferenceValues<Preferences>();

const TRELLO_KEY = preferences.apiKey;
const TRELLO_TOKEN = preferences.apiToken;
const TRELLO_LIST_ID = preferences.boardIdArya;
const TRELLO_MEMBERS = `${preferences.userIdArya},${preferences.UserIdAnu}`;
const TRELLO_TEMPLATES_LIST_ID = preferences.templatesListId;

export default function Command() {
  const [templateCards, setTemplateCards] = useState<TemplateCard[]>([]);
  const { pop } = useNavigation();

  useEffect(() => {
    async function fetchTemplateCards() {
      try {
        const response = await axios.get(`https://api.trello.com/1/lists/${TRELLO_TEMPLATES_LIST_ID}/cards`, {
          params: {
            key: TRELLO_KEY,
            token: TRELLO_TOKEN,
          },
        });
        setTemplateCards(response.data);
      } catch (error) {
        console.error("Failed to fetch template cards:", error);
      }
    }

    fetchTemplateCards();
  }, []);

  async function handleSubmit(values: Values) {
    let cardData;
    const currentDate = new Date();
    const formattedDate = `[${currentDate.getDate().toString().padStart(2, '0')}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getFullYear()}]`;

    if (values.templateCardId) {
      // Use template card data
      const templateCard = templateCards.find(card => card.id === values.templateCardId);
      if (templateCard) {
        cardData = {
          name: `${values.cardTitle || templateCard.name} ${formattedDate}`,
          desc: values.cardDescription || templateCard.desc,
          idList: TRELLO_LIST_ID,
          idMembers: TRELLO_MEMBERS.split(","),
          key: TRELLO_KEY,
          token: TRELLO_TOKEN,
        };
      }
    } else {
      // Default card data
      cardData = {
        name: values.cardTitle,
        desc: values.cardDescription,
        idList: TRELLO_LIST_ID,
        idMembers: TRELLO_MEMBERS.split(","),
        key: TRELLO_KEY,
        token: TRELLO_TOKEN,
      };
    }

    console.log("Request Data:", cardData); // Log the request data

    try {
      const response = await axios.post(`https://api.trello.com/1/cards`, null, {
        params: cardData,
      });
      if (response.status === 200 || response.status === 201) {
        showToast({ title: "Card Created", message: "Successfully created Trello card" });
        pop(); // Close the form after successful submission
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
      <Form.Description text="Create a Card for Arya in the Web Support Team Board." />
      <Form.Dropdown id="templateCardId" title="Template Card" defaultValue="">
        <Form.Dropdown.Item value="" title="No Template" />
        {templateCards.map((card) => (
          <Form.Dropdown.Item key={card.id} value={card.id} title={card.name} />
        ))}
      </Form.Dropdown>
      <Form.TextField id="cardTitle" title="Card Title" placeholder="Enter the card title" />
      <Form.TextArea id="cardDescription" title="Card Description" placeholder="Enter the card description" />
    </Form>
  );
}