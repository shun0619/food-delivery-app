import { Restaurant } from '@/types';
import React from 'react'
import RestaurantCard from './restaurant-card';

interface RestaurantListProps {
  restaurants: Restaurant[]; // Replace 'any' with a more specific type if available
}

export default function RestaurantList({restaurants}: RestaurantListProps  ) {
  return (
   <ul className='grid grid-cols-4 gap-4'>{restaurants.map((restaurant) => 
    <RestaurantCard key={restaurant.id} restaurant={restaurant} />
   )}</ul>
  )
}
