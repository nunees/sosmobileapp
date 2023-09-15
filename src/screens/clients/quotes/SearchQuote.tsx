import { AppHeader } from '@components/AppHeader';
import { ListEmpty } from '@components/ListEmpty';
import { LoadingModal } from '@components/LoadingModal';
import { PartnerCard } from '@components/PartnerCard';
import { ILocation } from '@dtos/ILocation';
import { useAuth } from '@hooks/useAuth';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import { VStack, useToast, FlatList } from 'native-base';
import { useEffect, useState } from 'react';

type RouteParamsProps = {
  serviceId: string;
};

export function SearchQuote() {
  const [isLoading, setIsLoading] = useState(false);
  const [locations, setLocations] = useState<ILocation[]>([]);

  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const routes = useRoute();
  const toast = useToast();
  const { serviceId } = routes.params as RouteParamsProps;

  const { user } = useAuth();

  async function findLocations(serviceId: string) {
    try {
      setIsLoading(true);
      const response = await api.get(`/locations/services/${serviceId}`, {
        headers: {
          id: user.id,
        },
      });
      setLocations(response.data);
      setIsLoading(false);
    } catch (error) {
      const title =
        error instanceof AppError ? error.message : 'Erro ao buscar parceiros';
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    findLocations(serviceId);
  }, []);

  return (
    <VStack>
      <VStack mb={5}>
        <AppHeader title="Parceiros disponiveis" />
      </VStack>

      {isLoading && (
        <LoadingModal
          showModal={isLoading}
          setShowModal={setIsLoading}
          message="Buscando profissionais disponiveis"
        />
      )}

      <VStack>
        <FlatList
          data={locations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <PartnerCard
                onPress={() =>
                  navigation.navigate('newQuote', {
                    locationId: item.id,
                    serviceId,
                  })
                }
                location={item}
                image={{
                  uri:
                    `${api.defaults.baseURL}/user/avatar/${item.user_id}/${item.users?.avatar}` ||
                    `https://ui-avatars.com/api/?name=${item.business_name}&background=random&length=1&rounded=true&size=128`,
                }}
              />
            );
          }}
          ListEmptyComponent={() => (
            <ListEmpty message="Nenhum local encontrado" />
          )}
        />
      </VStack>
    </VStack>
  );
}
