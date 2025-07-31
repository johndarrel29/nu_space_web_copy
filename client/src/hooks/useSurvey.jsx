import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from '../context/AuthContext';
import { Description } from "@headlessui/react";


function useSurvey(activityId) {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const createActivitySurvey = async ({ activityId, title, description, userId, surveyJSON }) => {
        const token = user?.token;
        const formattedToken = token ? `Bearer ${token}` : null;

        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/rsoRep/survey/createSurvey/${activityId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
                'platform': 'web',
            },
            body: JSON.stringify({
                title,
                description,
                userId,
                surveyJSON
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create survey');
        }

        if (response.status === 204) {
            return { message: "Survey created successfully" };
        }

        return response.json();

    }

    const getActivitySurveys = async () => {
        const token = user?.token;
        const formattedToken = token ? `Bearer ${token}` : null;

        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/rsoRep/survey/activitySurvey/${activityId}`, {
            method: 'GET',
            headers: {
                Authorization: token,
                'platform': 'web',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch surveys');
        }

        return response.json();
    }

    const {
        mutate: createActSurveyMutate,
        isLoading: isCreatingSurvey,
        isError: isCreateSurveyError,
        error: createSurveyError,

    } = useMutation({
        mutationFn: createActivitySurvey,
        onSuccess: () => {
            queryClient.invalidateQueries(['activitySurveys']);
        },
        onError: (error) => {
            console.error("Error creating survey:", error);
        }

    });

    const {
        data: activitySurveys,
        isLoading: isLoadingSurveys,
        isError: isErrorSurveys,
        error: surveysError,
    } = useQuery({
        queryKey: ['activitySurveys', activityId],
        queryFn: () => getActivitySurveys(activityId),
        enabled: !!user, // Only run if user is authenticated
    });

    return {
        createActSurveyMutate,
        isCreatingSurvey,
        isCreateSurveyError,
        createSurveyError,

        activitySurveys,
        isLoadingSurveys,
        isErrorSurveys,
        surveysError,
    };
}

export default useSurvey;
