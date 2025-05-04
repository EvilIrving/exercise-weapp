import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Card from '../Card';

const RecordsList = ({ records }) => {
  return (
    <ScrollView>
      <Text className="section-title">最近训练记录</Text>
      <Card>
        {records.map((record) => (
          <View key={record.id} className="record-item">
            <View className="record-info">
              <Text className="record-name">{record.exerciseName}</Text>
              <Text className="record-date">
                {new Date(record.date).toLocaleDateString()}
              </Text>
            </View>
            <View className="record-list">
              {record.sets.map((set) => (
                <Text key={set.id}>
                  {set.reps} 次 x {set.weight} kg
                </Text>
              ))}
            </View>
          </View>
        ))}
      </Card>
    </ScrollView>
  );
};

export default RecordsList;
