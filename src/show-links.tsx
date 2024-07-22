import { List, ActionPanel, Action, getPreferenceValues, showToast, Toast } from "@raycast/api";
import axios from "axios";
import { useEffect, useState } from "react";
import { formatDistanceToNow, parseISO } from "date-fns";

interface Preferences {
  apiKey: string;
  apiToken: string;
  userIdAnu: string; // Your Trello user ID
}

interface TrelloBoard {
  id: string;
  name: string;
}

interface TrelloCard {
  id: string;
  name: string;
  shortUrl: string;
  dateLastActivity: string;
  idMembers: string[];
}

interface Card {
  id: string;
  name: string;
  deepLink: string;
  boardName: string;
  dateLastActivity: string;
}

const preferences = getPreferenceValues<Preferences>();

const TRELLO_KEY = preferences.apiKey;
const TRELLO_TOKEN = preferences.apiToken;
const USER_ID_ANU = preferences.userIdAnu; // Your Trello user ID

export default function ShowSavedTrelloLinks() {
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCards() {
      try {
        const boardsResponse = await axios.get<TrelloBoard[]>(
          `https://api.trello.com/1/members/me/boards?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`,
        );

        const boards = boardsResponse.data;
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const cardPromises = boards.map((board) =>
          axios.get<TrelloCard[]>(
            `https://api.trello.com/1/boards/${board.id}/cards?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}&filter=open`,
          ),
        );

        const cardResponses = await Promise.all(cardPromises);

        const allCards: Card[] = cardResponses.flatMap((response, index) => {
          const board = boards[index];
          return response.data
            .filter((card) => {
              const isRecent = parseISO(card.dateLastActivity) > sevenDaysAgo;
              const isMember = card.idMembers.includes(USER_ID_ANU);
              return isRecent && isMember;
            })
            .map((card) => ({
              id: card.id,
              name: card.name,
              deepLink: `trello://trello.com/c/${card.id}`,
              boardName: board.name,
              dateLastActivity: card.dateLastActivity,
            }));
        });

        allCards.sort((a, b) => parseISO(b.dateLastActivity).getTime() - parseISO(a.dateLastActivity).getTime());

        setCards(allCards);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.error("Failed to fetch cards:", error.response?.data);
          showToast(Toast.Style.Failure, "Failed to fetch cards", error.message);
        } else {
          console.error("Failed to fetch cards:", error);
          showToast(Toast.Style.Failure, "Failed to fetch cards", String(error));
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchCards();
  }, []);

  return (
    <List isLoading={isLoading}>
      <List.Section title="Recently Active Trello Cards">
        {cards.map((card) => (
          <List.Item
            key={card.id}
            title={card.name}
            subtitle={`${card.boardName} - ${formatDistanceToNow(parseISO(card.dateLastActivity))} ago`}
            actions={
              <ActionPanel>
                <Action.OpenInBrowser url={card.deepLink} />
              </ActionPanel>
            }
          />
        ))}
      </List.Section>
    </List>
  );
}
