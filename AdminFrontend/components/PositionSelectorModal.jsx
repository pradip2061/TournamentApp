import axios from 'axios';
import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  StatusBar,
  Alert,
} from 'react-native';
import {baseUrl} from '../env';

// Dummy data for 10 players
const PlayerPositionModal = ({
  visible,
  onClose,
  players,
  matchType,
  match_id,
}) => {
  const [selectedPositions, setSelectedPositions] = useState([]);
  const [nextPosition, setNextPosition] = useState(1);

  // Calculate selection limit (35% of total players, rounded up)
  const selectionLimit = Math.ceil(players?.length * 0.35);
  const twoXLimit = 2;

  const handlePlayerSelect = playerId => {
    // Check if already at selection limit
    if (
      selectedPositions.length >= selectionLimit &&
      !selectedPositions.some(item => item.userId === playerId)
    ) {
      Alert.alert(
        'Selection Limit Reached',
        `You can only select ${selectionLimit} players (35% of total players).`,
        [{text: 'OK'}],
      );
      return;
    }

    // Check if player is already selected
    const existingIndex = selectedPositions.findIndex(
      item => item.userId === playerId,
    );

    if (existingIndex !== -1) {
      // Player already selected, remove them and adjust nextPosition
      const removedPosition = selectedPositions[existingIndex].position;
      const newPositions = selectedPositions.filter(
        item => item.userId !== playerId,
      );

      // Adjust positions of players who were selected after the removed player
      const adjustedPositions = newPositions.map(item => {
        if (item.position > removedPosition) {
          return {...item, position: item.position - 1};
        }
        return item;
      });

      setSelectedPositions(adjustedPositions);
      setNextPosition(Math.min(removedPosition, adjustedPositions.length + 1));
    } else {
      const multiplier = nextPosition <= twoXLimit ? '3x' : '1.5x';

      setSelectedPositions([
        ...selectedPositions,
        {
          userId: playerId,
          position: nextPosition,
          multiplier: multiplier,
        },
      ]);
      setNextPosition(nextPosition + 1);
    }
  };

  const getPlayerPosition = playerId => {
    const player = selectedPositions.find(item => item.userId === playerId);
    return player ? player.position : null;
  };

  const getPlayerMultiplier = playerId => {
    const player = selectedPositions.find(item => item.userId === playerId);
    return player ? player.multiplier : null;
  };

  const handleDistribute = async () => {
    // Sort positions to ensure they are in correct order
    const sortedPositions = [...selectedPositions].sort(
      (a, b) => a.position - b.position,
    );

    // Get all unselected player IDs
    const selectedPlayerIds = selectedPositions.map(item => item.userId);
    const unselectedPlayers = players
      .filter(player => !selectedPlayerIds.includes(player.id))
      .map(player => ({
        userId: player.id,
        position: nextPosition, // All unselected players get the same "last" position
        multiplier: '1.5x', // All unselected players get 1.5x
      }));

    // Define player groups FIRST before using them
    const players3x = sortedPositions.filter(
      player => player.multiplier === '3x',
    );
    const players1_5x = sortedPositions.filter(
      player => player.multiplier === '1.5x',
    );

    // Now that they're defined, we can use them
    const Notify_group1 = players3x.map(item => item.userId);
    const Notify_group2 = players1_5x.map(item => item.userId);
    const Notify_group3 = unselectedPlayers.map(item => item.userId);

    const toDistribute = {
      player3x: players3x,
      player1_5x: players1_5x,
      unselected: unselectedPlayers,
      matchType,
      match_id,
    };

    console.log('Match Type : ', matchType);
    console.log(toDistribute);

    try {
      // Fix the URL: Use baseUrl and fix the double slash
      const response = await axios.post(
        `${baseUrl}/khelmela/admin/distribute-prizes`,
        toDistribute,
      );

      console.log('Distribution Data:', response.data);
      console.log('Status:', response.status);

      if (response.status === 200) {
        // Combine all groups for notification
        const allRecipients = [...Notify_group1, ...Notify_group2];

        const notify = await axios.post(
          `${baseUrl}/khelmela/SAP-1/send-notification`,
          {
            message:
              'Congratulation on your win, your prize is credited to your account',
            reciver: allRecipients,
          },
        );
        console.log('Notify data:', notify.data);

        const notify_loss = await axios.post(
          `${baseUrl}/khelmela/SAP-1/send-notification`,
          {
            message:
              ' Thank you for playing , We Appreciate your sportsmanship ',
            reciver: Notify_group3,
          },
        );
        console.log('Notify Loss  data:', notify_loss.data);

        Alert.alert(
          'Success',
          'Positions distributed and notifications sent successfully',
        );
      }
    } catch (error) {
      console.error('Error during distribution:', error);
      Alert.alert(
        'Error',
        'Failed to distribute prizes. Check console for details.',
      );
    }
  };

  const renderPlayer = ({item}) => {
    const position = getPlayerPosition(item.id);
    const multiplier = getPlayerMultiplier(item.id);
    const isSelected = position !== null;

    // Determine badge color based on multiplier
    const badgeColor = multiplier === '3x' ? '#FFD700' : '#FF8C00'; // Gold for 3x, Orange for 1.5x

    return (
      <TouchableOpacity
        style={[
          styles.playerCard,
          isSelected && styles.selectedPlayerCard,
          isSelected && multiplier === '3x' && styles.selected3xPlayerCard,
          isSelected && multiplier === '1.5x' && styles.selected1_5xPlayerCard,
        ]}
        onPress={() => handlePlayerSelect(item.id)}>
        <Image source={item?.image} style={styles.playerImage} />
        <View style={styles.playerInfo}>
          <Text style={styles.gameName}>{item.gameName}</Text>
          <Text style={styles.username}>{item.username}</Text>
        </View>
        {isSelected && (
          <View style={[styles.positionBadge, {backgroundColor: badgeColor}]}>
            <Text style={styles.positionText}>{position}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Select Player Positions</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.instruction}>
          Tap on players to assign positions. First 2 players get 3x (Gold),
          remaining get 1.5X (Orange). Maximum {selectionLimit} players can be
          selected.
        </Text>

        <FlatList
          data={players}
          renderItem={renderPlayer}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />

        <View style={styles.footer}>
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>
              Selected: {selectedPositions.length}/{selectionLimit} players
            </Text>
            <Text style={styles.statsText}>
              3x: {selectedPositions.filter(p => p.multiplier === '3x').length}/
              {twoXLimit} players
            </Text>
            <Text style={styles.statsText}>
              1.5X:{' '}
              {selectedPositions.filter(p => p.multiplier === '1.5x').length}{' '}
              players
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.distributeButton,
              selectedPositions.length === 0 && styles.disabledButton,
            ]}
            onPress={handleDistribute}
            disabled={selectedPositions.length === 0}>
            <Text style={styles.distributeButtonText}>Distribute</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  toggleLabel: {
    marginHorizontal: 10,
    fontSize: 16,
    color: '#666',
  },
  activeToggleLabel: {
    fontWeight: 'bold',
    color: '#333',
  },
  instruction: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 14,
    color: '#666',
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  listContainer: {
    padding: 10,
  },
  playerCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  selectedPlayerCard: {
    borderWidth: 1,
  },
  selected3xPlayerCard: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)', // Light gold background
    borderColor: '#FFD700',
  },
  selected1_5xPlayerCard: {
    backgroundColor: 'rgba(255, 140, 0, 0.1)', // Light orange background
    borderColor: '#FF8C00',
  },
  playerImage: {
    width: 40, // Reduced from 50 to make it more compact
    height: 40, // Reduced from 50 to make it more compact
    borderRadius: 20, // Half of width/height
    backgroundColor: '#e0e0e0',
  },
  playerInfo: {
    flex: 1,
    marginLeft: 15,
  },
  gameName: {
    fontSize: 15, // Slightly reduced
    fontWeight: 'bold',
    color: '#333',
  },
  username: {
    fontSize: 13, // Slightly reduced
    color: '#666',
    marginTop: 2,
  },
  positionBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  positionText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  statsText: {
    color: '#666',
    fontSize: 14,
  },
  distributeButton: {
    backgroundColor: '#4b9cdb',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  distributeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PlayerPositionModal;
