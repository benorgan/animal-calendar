import { FlatList, ImageBackground, SafeAreaView, StyleSheet } from 'react-native'
import { Text, View } from '@/components/Themed'
import { Day, addDays, isEqual, startOfDay, startOfWeek } from 'date-fns'
import { usePicturesApi } from '@/components/usePicturesApi'
import { PICTURE_TYPE, DAYS_TO_SHOW, WEEK_STARTS_ON } from '@/constants/Settings'
import { useState } from 'react'

const loading = require('../../assets/images/loading.gif')

export default function Calendar() {

  const { pictures, fetchPictures } = usePicturesApi(PICTURE_TYPE, DAYS_TO_SHOW)
  const [refreshing, setRefreshing] = useState<boolean>(false)

  const generateCalendar = (weekStartsOn: Day, daysToShow: number): Array<Date> => {
    const start = startOfWeek(new Date(), { weekStartsOn })
    const calendar = []
  
    for(let i = 0; i < daysToShow; i++) {
      calendar.push(addDays(start, i))
    }

    return calendar
  }

  const refreshPictures = async () => {
    setRefreshing(true)
    await fetchPictures()
    setRefreshing(false)
  }

  const renderDay = ({ item , index}: { item: Date, index: number}) => {

    const today = new Date()

    // Need to check startOfDay here so we're comparing the same time
    const isToday = isEqual(startOfDay(item), startOfDay(today))

    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };

    return (
      <View style={isToday ? [styles.day, styles.today] : styles.day}>
        <ImageBackground 
          style={styles.image} 
          source={pictures.length ? { uri: pictures[index] } : loading}
        >
          <Text style={isToday ? [styles.dayTitle, styles.todayDayTitle] : styles.dayTitle}>
            {
              // Omit locale parameter since we want to use the default 
              item.toLocaleDateString(undefined, options)
            }
          </Text> 
        </ImageBackground>
      </View>
   ) 
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{`${PICTURE_TYPE} calendar`}</Text>
      <FlatList
        data={generateCalendar(WEEK_STARTS_ON, DAYS_TO_SHOW)}
        renderItem={renderDay}
        style={styles.list}
        onRefresh={refreshPictures}
        refreshing={refreshing}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: '50%',
    marginVertical: 10,
    marginHorizontal: 'auto',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textTransform: 'capitalize'
  },
  list: {
    width: '100%',
  },
  day: {
    flex: 1,
    marginHorizontal: 10,
    marginVertical: 5,
    borderWidth: 4,
    borderColor: '#aaa'
  },
  dayTitle: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    color: '#000'
  },
  today: {
    borderColor: '#0af'
  },
  todayDayTitle: {
    backgroundColor: 'rgba(0, 170, 255, 0.7)'
  },
  image: {
    height: 200,
    width: 'auto',
    backgroundColor: '#eee'
  }
})