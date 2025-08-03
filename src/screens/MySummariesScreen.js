import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Alert,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { simpleStorage } from '../../SIMPLE_CHECKIN_STORAGE';

export default function MySummariesScreen() {
  const { user } = useAuth();
  const [summaries, setSummaries] = useState([]);
  const [allSummaries, setAllSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSummary, setSelectedSummary] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [availableYears, setAvailableYears] = useState([]);
  const [availableMonths, setAvailableMonths] = useState([]);

  useEffect(() => {
    loadSummaries();
  }, []);

  useEffect(() => {
    if (allSummaries.length > 0) {
      generateFilterOptions();
    }
  }, [allSummaries]);

  const generateFilterOptions = () => {
    const years = [...new Set(allSummaries.map(summary => 
      new Date(summary.created_at).getFullYear()
    ))].sort((a, b) => b - a); // Sort descending (newest first)
    
    const months = [
      { value: 1, label: 'January' },
      { value: 2, label: 'February' },
      { value: 3, label: 'March' },
      { value: 4, label: 'April' },
      { value: 5, label: 'May' },
      { value: 6, label: 'June' },
      { value: 7, label: 'July' },
      { value: 8, label: 'August' },
      { value: 9, label: 'September' },
      { value: 10, label: 'October' },
      { value: 11, label: 'November' },
      { value: 12, label: 'December' },
    ];
    
    setAvailableYears(years);
    setAvailableMonths(months);
  };

  const applyFilters = () => {
    let filtered = [...allSummaries];
    
    if (selectedYear) {
      filtered = filtered.filter(summary => 
        new Date(summary.created_at).getFullYear() === selectedYear
      );
    }
    
    if (selectedMonth) {
      filtered = filtered.filter(summary => 
        new Date(summary.created_at).getMonth() + 1 === selectedMonth
      );
    }
    
    setSummaries(filtered);
    setFilterVisible(false);
  };

  const clearFilters = () => {
    setSelectedYear(null);
    setSelectedMonth(null);
    setSummaries(allSummaries);
    setFilterVisible(false);
  };

  const getFilterStatus = () => {
    const filters = [];
    if (selectedYear) filters.push(`Year: ${selectedYear}`);
    if (selectedMonth) {
      const monthLabel = availableMonths.find(m => m.value === selectedMonth)?.label;
      filters.push(`Month: ${monthLabel}`);
    }
    return filters.length > 0 ? filters.join(', ') : 'All Time';
  };

  const loadSummaries = async () => {
    try {
      setLoading(true);
      const allCheckIns = await simpleStorage.getAllCheckIns();
      console.log('=== LOADING SUMMARIES DEBUG ===');
      console.log('All check-ins loaded:', allCheckIns.length);
      console.log('Current user ID:', user?.id);
      console.log('User object:', user);
      
      // Show all check-ins for debugging
      allCheckIns.forEach((checkIn, index) => {
        console.log(`Check-in ${index + 1}:`, {
          id: checkIn.id,
          user_id: checkIn.user_id,
          date: checkIn.created_at,
          hasAiSummary: !!checkIn.ai_summary,
          aiSummaryLength: checkIn.ai_summary?.length || 0,
          aiSummaryPreview: checkIn.ai_summary?.substring(0, 100) + '...'
        });
      });
      
      // Try multiple user ID matching strategies
      let userCheckIns = [];
      
      if (user?.id) {
        // First try exact match
        userCheckIns = allCheckIns.filter(checkIn => checkIn.user_id === user.id);
        console.log(`Found ${userCheckIns.length} check-ins with exact user ID match`);
        
        // If no results, try with 'default-user' (fallback)
        if (userCheckIns.length === 0) {
          userCheckIns = allCheckIns.filter(checkIn => checkIn.user_id === 'default-user');
          console.log(`Found ${userCheckIns.length} check-ins with default-user ID`);
        }
        
        // If still no results, show all check-ins (for debugging)
        if (userCheckIns.length === 0) {
          console.log('No user-specific check-ins found, showing all check-ins for debugging');
          userCheckIns = allCheckIns;
        }
      } else {
        // If no user ID, show all check-ins
        console.log('No user ID available, showing all check-ins');
        userCheckIns = allCheckIns;
      }
      
      console.log('Final user check-ins:', userCheckIns.length);
      userCheckIns.forEach((checkIn, index) => {
        console.log(`Final check-in ${index + 1}:`, {
          id: checkIn.id,
          date: checkIn.created_at,
          hasAiSummary: !!checkIn.ai_summary,
          aiSummaryLength: checkIn.ai_summary?.length || 0
        });
      });
      
      setAllSummaries(userCheckIns);
      setSummaries(userCheckIns);
    } catch (error) {
      console.error('Error loading summaries:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSummaries();
    setRefreshing(false);
  };

  const handleSummaryPress = (summary) => {
    console.log('=== SUMMARY PRESSED ===');
    console.log('Summary pressed:', summary);
    console.log('AI Summary:', summary?.ai_summary);
    console.log('Current modalVisible:', modalVisible);
    
    // Set the selected summary first
    setSelectedSummary(summary);
    
    // Then set modal visible with a small delay to ensure state is set
    setTimeout(() => {
      console.log('Setting modal visible to true');
      setModalVisible(true);
    }, 50);
  };

  const closeModal = () => {
    console.log('Closing modal');
    setModalVisible(false);
    setTimeout(() => {
      setSelectedSummary(null);
    }, 300);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.gradient}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#fff"
              colors={['#fff']}
            />
          }
        >
          <Text style={styles.headerTitle}>My Summaries</Text>
          <Text style={styles.headerSubtitle}>Tap any date to read your AI coach advice</Text>

          {/* Filter Section */}
          <View style={styles.filterSection}>
            <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>Filter by Time</Text>
              <TouchableOpacity
                style={styles.filterButton}
                onPress={() => setFilterVisible(true)}
              >
                <Ionicons name="filter" size={20} color="#fff" />
                <Text style={styles.filterButtonText}>Filter</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.filterStatus}>{getFilterStatus()}</Text>
            <Text style={styles.filterCount}>Showing {summaries.length} of {allSummaries.length} summaries</Text>
          </View>

          {summaries.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="document-text-outline" size={64} color="rgba(255, 255, 255, 0.5)" />
              <Text style={styles.emptyTitle}>No summaries found</Text>
              <Text style={styles.emptySubtitle}>
                {allSummaries.length > 0 
                  ? 'Try adjusting your filters to see more summaries'
                  : 'Complete your first check-in to get personalized AI coach advice'
                }
              </Text>
              {allSummaries.length > 0 && (
                <TouchableOpacity
                  style={styles.clearFilterButton}
                  onPress={clearFilters}
                >
                  <Ionicons name="refresh" size={20} color="#fff" />
                  <Text style={styles.clearFilterButtonText}>Clear Filters</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View style={styles.summariesContainer}>
              {summaries.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.summaryCard}
                  onPress={() => handleSummaryPress(item)}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
                    style={styles.summaryGradient}
                  >
                    <View style={styles.summaryHeader}>
                      <Ionicons name="document-text-outline" size={28} color="#fff" style={{ marginRight: 10 }} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.summaryDate}>{new Date(item.created_at).toLocaleDateString()}</Text>
                        <Text style={styles.tapHint}>
                          {item.ai_summary ? 'Tap to read AI coach advice →' : 'AI summary not available'}
                        </Text>
                      </View>
                      <Ionicons
                        name="chevron-forward"
                        size={24}
                        color="#fff"
                        style={{ opacity: 0.7 }}
                      />
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      </LinearGradient>

      {/* Filter Modal */}
      <Modal
        visible={filterVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setFilterVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Summaries</Text>
              <TouchableOpacity onPress={() => setFilterVisible(false)} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              {/* Year Filter */}
              <View style={styles.filterGroup}>
                <Text style={styles.filterGroupTitle}>Year</Text>
                <View style={styles.filterOptions}>
                  <TouchableOpacity
                    style={[
                      styles.filterOption,
                      selectedYear === null && styles.filterOptionSelected
                    ]}
                    onPress={() => setSelectedYear(null)}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      selectedYear === null && styles.filterOptionTextSelected
                    ]}>All Years</Text>
                  </TouchableOpacity>
                  {availableYears.map((year) => (
                    <TouchableOpacity
                      key={year}
                      style={[
                        styles.filterOption,
                        selectedYear === year && styles.filterOptionSelected
                      ]}
                      onPress={() => setSelectedYear(year)}
                    >
                      <Text style={[
                        styles.filterOptionText,
                        selectedYear === year && styles.filterOptionTextSelected
                      ]}>{year}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Month Filter */}
              <View style={styles.filterGroup}>
                <Text style={styles.filterGroupTitle}>Month</Text>
                <View style={styles.filterOptions}>
                  <TouchableOpacity
                    style={[
                      styles.filterOption,
                      selectedMonth === null && styles.filterOptionSelected
                    ]}
                    onPress={() => setSelectedMonth(null)}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      selectedMonth === null && styles.filterOptionTextSelected
                    ]}>All Months</Text>
                  </TouchableOpacity>
                  {availableMonths.map((month) => (
                    <TouchableOpacity
                      key={month.value}
                      style={[
                        styles.filterOption,
                        selectedMonth === month.value && styles.filterOptionSelected
                      ]}
                      onPress={() => setSelectedMonth(month.value)}
                    >
                      <Text style={[
                        styles.filterOptionText,
                        selectedMonth === month.value && styles.filterOptionTextSelected
                      ]}>{month.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Filter Actions */}
              <View style={styles.filterActions}>
                <TouchableOpacity
                  style={styles.clearFilterAction}
                  onPress={clearFilters}
                >
                  <Text style={styles.clearFilterActionText}>Clear All</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.applyFilterAction}
                  onPress={applyFilters}
                >
                  <Text style={styles.applyFilterActionText}>Apply Filters</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Summary Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedSummary ? new Date(selectedSummary.created_at).toLocaleDateString() : 'Summary'}
              </Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              {selectedSummary?.ai_summary ? (
                <Text style={styles.modalSummaryText}>
                  {selectedSummary.ai_summary}
                </Text>
              ) : (
                <View style={styles.noSummaryView}>
                  <Ionicons name="document-text-outline" size={48} color="#ccc" />
                  <Text style={styles.noSummaryTitle}>AI Summary Not Available</Text>
                  <Text style={styles.noSummaryText}>
                    The AI coach advice for this check-in is not available.
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#667eea',
  },
  scrollView: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 60,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
    textAlign: 'center',
    marginBottom: 30,
  },
  filterSection: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  filterTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  filterStatus: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    marginBottom: 10,
  },
  filterCount: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.7,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  clearFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  clearFilterButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  summariesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  summaryCard: {
    marginBottom: 16,
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  summaryGradient: {
    borderRadius: 18,
    padding: 16,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryDate: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  tapHint: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '100%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
    maxHeight: 400,
  },
  modalSummaryText: {
    fontSize: 16,
    lineHeight: 26,
    color: '#333',
    textAlign: 'left',
  },
  noSummaryView: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  noSummaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 15,
    marginBottom: 10,
  },
  noSummaryText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  filterGroup: {
    marginBottom: 20,
  },
  filterGroupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  filterOption: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterOptionSelected: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  filterOptionText: {
    color: '#333',
    fontSize: 14,
    fontWeight: 'bold',
  },
  filterOptionTextSelected: {
    color: '#fff',
  },
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  clearFilterAction: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  clearFilterActionText: {
    color: '#333',
    fontSize: 14,
    fontWeight: 'bold',
  },
  applyFilterAction: {
    backgroundColor: '#667eea',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  applyFilterActionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
}); 