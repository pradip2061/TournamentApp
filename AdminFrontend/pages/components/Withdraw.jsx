import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {baseUrl} from '../../env';
import axios from 'axios';
import WithdrawRequestCard from './WithdrawRequestCard';

const Withdraw = onRequestUpdate => {
  const [withdrawRequests, setWithdrawRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState('pending'); // Default filter
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWithdrawRequests();
  }, []);

  const fetchWithdrawRequests = async () => {
    setLoading(true);
    console.log(`${baseUrl}/khelmela/admin/money/getWithdrawRequest`);

    try {
      const response = await axios.get(
        `${baseUrl}/khelmela/admin/money/getWithdrawRequest`,
      );
      setWithdrawRequests(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching withdraw requests:', error);
      setError('Failed to load withdraw requests. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Function to filter items based on status
  const getFilteredRequests = () => {
    if (statusFilter === 'pending') {
      return withdrawRequests.filter(
        request =>
          request.status !== 'approved' && request.status !== 'rejected',
      );
    } else if (statusFilter === 'approved') {
      return withdrawRequests.filter(request => request.status === 'approved');
    } else if (statusFilter === 'rejected') {
      return withdrawRequests.filter(request => request.status === 'rejected');
    } else {
      return withdrawRequests; // 'all' or any other case
    }
  };

  // Pull to refresh handler
  const handleRefresh = () => {
    fetchWithdrawRequests();
  };

  const filteredRequests = getFilteredRequests();

  return (
    <View style={styles.container}>
      {/* Status Filter Buttons */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={
            statusFilter === 'pending'
              ? styles.activeFilterButton
              : styles.filterButton
          }
          onPress={() => setStatusFilter('pending')}>
          <Text
            style={
              statusFilter === 'pending'
                ? styles.activeFilterText
                : styles.filterText
            }>
            Pending ‼️
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={
            statusFilter === 'approved'
              ? styles.activeFilterButton
              : styles.filterButton
          }
          onPress={() => setStatusFilter('approved')}>
          <Text
            style={
              statusFilter === 'approved'
                ? styles.activeFilterText
                : styles.filterText
            }>
            Approved ✅
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={
            statusFilter === 'rejected'
              ? styles.activeFilterButton
              : styles.filterButton
          }
          onPress={() => setStatusFilter('rejected')}>
          <Text
            style={
              statusFilter === 'rejected'
                ? styles.activeFilterText
                : styles.filterText
            }>
            Rejected ❌
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={
            statusFilter === 'all'
              ? styles.activeFilterButton
              : styles.filterButton
          }
          onPress={() => setStatusFilter('all')}>
          <Text
            style={
              statusFilter === 'all'
                ? styles.activeFilterText
                : styles.filterText
            }>
            All
          </Text>
        </TouchableOpacity>
      </View>

      {/* Refresh Button */}
      <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
        <Text style={styles.refreshText}>↻ Refresh</Text>
      </TouchableOpacity>

      {/* Filter Summary */}
      <Text style={styles.filterSummary}>
        Showing {filteredRequests.length}{' '}
        {statusFilter !== 'all' ? statusFilter : ''} withdraw requests
      </Text>

      {/* Loading and Error States */}
      {loading ? (
        <View style={styles.centerContainer}>
          <Text>Loading withdraw requests...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchWithdrawRequests}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView>
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request, index) => (
              <WithdrawRequestCard
                key={index}
                id={request._id}
                username={request.username}
                amount={request.amount}
                selectedMethod={request.selectedMethod}
                image={request.image}
                date={request.date}
                status={request.status}
                Number={request.Number}
                senderId={request.senderId}
                statusmessage={request.statusmessage}
                handleRefresh={handleRefresh}
              />
            ))
          ) : (
            <View style={styles.noRequestsContainer}>
              <Text style={styles.noRequestsText}>
                No {statusFilter} withdraw requests found
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  // Filter styles
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    paddingHorizontal: 5,
  },
  filterButton: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    marginHorizontal: 2,
  },
  activeFilterButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    marginHorizontal: 2,
  },
  filterText: {
    color: '#333',
    fontSize: 12,
  },
  activeFilterText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  refreshButton: {
    backgroundColor: '#0066CC',
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 15,
    alignSelf: 'center',
    marginBottom: 10,
  },
  refreshText: {
    color: 'white',
    fontWeight: 'bold',
  },
  filterSummary: {
    textAlign: 'center',
    marginBottom: 10,
    fontStyle: 'italic',
    color: '#555',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 15,
  },
  retryButton: {
    backgroundColor: '#0066CC',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  retryText: {
    color: 'white',
    fontWeight: 'bold',
  },
  noRequestsContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    margin: 10,
    borderRadius: 10,
    height: 100,
  },
  noRequestsText: {
    fontSize: 16,
    color: '#888',
  },
});

export default Withdraw;
