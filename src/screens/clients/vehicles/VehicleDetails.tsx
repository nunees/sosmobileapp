import { AppHeader } from '@components/AppHeader';
import { Input } from '@components/Input';
import { IVehicleDTO } from '@dtos/IVechicleDTO';
import { useAuth } from '@hooks/useAuth';
import { useRoute } from '@react-navigation/native';
import { api } from '@services/api';
import { ScrollView, VStack, Text, useToast, Heading } from 'native-base';
import { useEffect, useState } from 'react';

type RouteParamsProps = {
  vehicleId: string;
};

export function VehicleDetails() {
  const route = useRoute();
  const toast = useToast();

  const { user } = useAuth();

  const { vehicleId } = route.params as RouteParamsProps;

  const [vehicle, setVehicle] = useState<IVehicleDTO>({} as IVehicleDTO);

  async function fetchVehicleDetails() {
    try {
      const response = await api.get(`/vehicles/${vehicleId}`, {
        headers: {
          id: user.id,
        },
      });
      setVehicle(response.data as IVehicleDTO);
    } catch {
      toast.show({
        title: 'Erro ao buscar detalhes do veículo',
        placement: 'top',
        bgColor: 'red.500',
      });
    }
  }

  useEffect(() => {
    fetchVehicleDetails();
  }, []);

  return (
    <VStack>
      <VStack>
        <AppHeader title="Detalhes do Veículo" />
      </VStack>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <VStack px={10} py={10}>
          <VStack mb={40}>
            <Heading pb={10}>Detalhes</Heading>
            <Text bold>Montadora</Text>
            <Input value={vehicle.brand?.name} editable={false} />
            <Text bold>Modelo</Text>
            <Input value={vehicle.name?.name} editable={false} />

            <Text bold>Cor</Text>
            <Input value={vehicle.color} editable={false} />

            <Text bold>Ano de Fabricação</Text>
            <Input value={String(vehicle.year)} editable={false} />

            <Text bold>Placa</Text>
            <Input value={vehicle.plate} editable={false} />

            <Text bold>Kilometragen</Text>
            <Input value={String(vehicle.engineMiles)} editable={false} />

            <Text bold>Total Gasto (R$)</Text>
            <Input value={'0'} editable={false} />
          </VStack>
        </VStack>
      </ScrollView>
    </VStack>
  );
}
