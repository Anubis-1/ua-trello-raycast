import { List, ActionPanel, Action, getPreferenceValues, showToast, Toast } from "@raycast/api";
import axios from "axios";
import { useEffect, useState } from "react";

interface Preferences {
  apiKey: string;
  apiToken: string;
}

interface TrelloCard {
  id: string;
  name: string;
  shortUrl: string;
  idList: string;
}

interface TrelloList {
  id: string;
  name: string;
}

interface Card {
  id: string;
  name: string;
  deeplink: string;
  listName: string;
}

const preferences = getPreferenceValues<Preferences>();

const TRELLO_KEY = preferences.apiKey;
const TRELLO_TOKEN = preferences.apiToken;

export default function SearchTrelloCards() {
  const [cards, setCards] = useState<Card[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!searchText) {
      setCards([]);
      return;
    }

    async function searchCards() {
      setIsLoading(true);
      try {
        const response = await axios.get<{ cards: TrelloCard[] }>(
          `https://api.trello.com/1/search?query=${searchText}&key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`,
        );

        const searchResults = response.data.cards;

        // Fetch the list names for each card
        const cardPromises = searchResults.map(async (card) => {
          const listResponse = await axios.get<TrelloList>(
            `https://api.trello.com/1/lists/${card.idList}?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`,
          );

          const listName = listResponse.data.name;

          return {
            id: card.id,
            name: card.name,
            deeplink: `trello://trello.com/c/${card.id}`,
            listName: listName,
          };
        });

        const cards = await Promise.all(cardPromises);

        setCards(cards);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          showToast(Toast.Style.Failure, "Failed to fetch cards", error.message);
        } else {
          showToast(Toast.Style.Failure, "Failed to fetch cards", String(error));
        }
      } finally {
        setIsLoading(false);
      }
    }

    searchCards();
  }, [searchText]);

  return (
    <List
      isLoading={isLoading}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder="Search Trello cards by name"
      throttle
    >
      <List.Section title="Search Results">
        {cards.map((card) => (
          <List.Item
            key={card.id}
            title={card.name}
            subtitle={card.listName}
            actions={
              <ActionPanel>
                <Action.OpenInBrowser url={card.deeplink} />
              </ActionPanel>
            }
          />
        ))}
      </List.Section>
    </List>
  );
}
