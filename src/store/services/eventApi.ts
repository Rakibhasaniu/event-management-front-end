/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CreateEventData, ApiResponse, Event } from '@/types';
import Cookies from 'js-cookie';

export const eventApi = createApi({
  reducerPath: 'eventApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6000'}/api/v1`,
    prepareHeaders: (headers) => {
      const token = Cookies.get('accessToken');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Event', 'UserEvents'],
  endpoints: (builder) => ({
    getEvents: builder.query<ApiResponse<{ events: Event[]; meta: any }>, Record<string, any> | void>({
      query: (params) => {
        const queryString = params ? new URLSearchParams(params).toString() : '';
        return `/events${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['Event'],
    }),
    getEvent: builder.query<ApiResponse<Event>, string>({
      query: (id) => `/events/${id}`,
      providesTags: (result, error, id) => [{ type: 'Event', id }],
    }),
    createEvent: builder.mutation<ApiResponse<Event>, CreateEventData>({
      query: (data) => ({
        url: '/events/create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Event', 'UserEvents'],
    }),
    updateEvent: builder.mutation<ApiResponse<Event>, { id: string; data: Partial<CreateEventData> }>({
      query: ({ id, data }) => ({
        url: `/events/${id}/update`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Event', id },
        'Event',
        'UserEvents',
      ],
    }),
    deleteEvent: builder.mutation<ApiResponse<any>, string>({
      query: (id) => ({
        url: `/events/${id}/delete`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Event', 'UserEvents'],
    }),
    rsvpEvent: builder.mutation<ApiResponse<Event>, { id: string; rsvpStatus: string }>({
      query: ({ id, rsvpStatus }) => ({
        url: `/events/${id}/rsvp`,
        method: 'POST',
        body: { rsvpStatus },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Event', id },
        'Event',
      ],
    }),
    getUserEvents: builder.query<ApiResponse<{ events: Event[]; meta: any }>, Record<string, any> | void>({
      query: (params) => {
        const queryString = params ? new URLSearchParams(params).toString() : '';
        return `/events/user/my-events${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['UserEvents'],
    }),
  }),
});

export const {
  useGetEventsQuery,
  useGetEventQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useRsvpEventMutation,
  useGetUserEventsQuery,
} = eventApi;