import EngineService from '@assets/services/car-engine.png';
import WashService from '@assets/services/car-service.png';
import GearService from '@assets/services/gear.png';
import GlassService from '@assets/services/glass.png';
import OilService from '@assets/services/oil.png';
import EletricService from '@assets/services/spark-plug.png';
import PaintService from '@assets/services/spray-gun.png';
import SuspensionService from '@assets/services/suspension.png';
import AccessoriesService from '@assets/services/usb.png';
import WhellService from '@assets/services/wheel.png';
import AssistanceService from '@assets/services/worker.png';
import { FavoriteCars } from '@components/FavoriteCars';
import { ReminderBell } from '@components/ReminderBell';
import { ServicesSmallCard } from '@components/ServicesSmallCard';
import { SmallSchedulleCard } from '@components/SmallSchedulleCard';
import { UserLocation } from '@components/UserLocation';
import { ISchedules } from '@dtos/ISchedules';
import { IVehicleDTO } from '@dtos/IVechicleDTO';
import { useAuth } from '@hooks/useAuth';
import { useProfile } from '@hooks/useProfile';
import { useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import {
  HStack,
  Heading,
  ScrollView,
  VStack,
  Text,
  Box,
  Center,
  Pressable,
} from 'native-base';
import { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';

export function HomeScreen() {
  const [vehicles, setVehicles] = useState<IVehicleDTO[]>([]);
  const [schedules, setSchedules] = useState<ISchedules[]>([]);

  const { user } = useAuth();
  const { profile } = useProfile();

  const navigation = useNavigation<AppNavigatorRoutesProps>();

  function greeting() {
    const hours = new Date().getHours();
    if (hours >= 0 && hours < 12) {
      return 'Bom dia';
    }
    if (hours >= 12 && hours < 18) {
      return 'Boa tarde';
    }
    return 'Boa noite';
  }

  async function fetchUserVehicles() {
    try {
      const response = await api.get('/vehicles/', {
        headers: {
          id: user.id,
        },
      });
      setVehicles(response.data);
    } catch (error) {
      throw new AppError('Erro ao buscar veículos');
    }
  }

  async function fetchSchedules() {
    try {
      const response = await api.get('/schedules/', {
        headers: {
          id: user.id,
        },
      });
      setSchedules(response.data);
    } catch (error) {
      throw new AppError('Erro ao buscar agendamentos');
    }
  }

  useEffect(() => {
    fetchUserVehicles();
    fetchSchedules();
  }, []);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <VStack>
        <HStack mb={5} justifyContent={'center'}>
          <UserLocation />
        </HStack>
        <HStack justifyContent={'space-between'}>
          <HStack justifyItems={'baseline'}>
            <TouchableOpacity
              onPress={() => navigation.navigate('profile')}
            ></TouchableOpacity>
            <Box ml={2} pb={10}>
              <Text>{`${user.name}`}</Text>
              <Heading color="gray.200">{`${greeting()}!`}</Heading>
            </Box>
          </HStack>
          <HStack mt={3}>
            <ReminderBell />
          </HStack>
        </HStack>

        <VStack>
          <HStack justifyContent={'space-between'}>
            <Text bold mb={2} ml={5} color="gray.200">
              Meus Veículos
            </Text>

            <Pressable
              onPress={() => navigation.navigate('vehicles')}
              bg="white"
            >
              <Text mb={2} color="gray.400">
                Ver todos
              </Text>
            </Pressable>
          </HStack>
        </VStack>

        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          disableIntervalMomentum={true}
          snapToInterval={400}
        >
          {vehicles.length > 0 ? (
            vehicles.map((vehicle) => (
              <FavoriteCars vehicle={vehicle} key={vehicle.id} />
            ))
          ) : (
            <VStack px={10} py={5}>
              <TouchableOpacity
                onPress={() => navigation.navigate('addVehicle')}
              >
                <Center bg="white">
                  <Text color="gray.400">
                    Você não possui veículos cadastrados
                  </Text>
                  <Text color="orange.600" bold>
                    Toque aqui para adicionar
                  </Text>
                </Center>
              </TouchableOpacity>
            </VStack>
          )}
        </ScrollView>

        <VStack>
          <HStack justifyContent={'space-between'}>
            <Text bold mb={2} ml={5}>
              Escolha um serviço
            </Text>

            <TouchableOpacity>
              <Text mb={2} color="gray.400">
                Ver todos
              </Text>
            </TouchableOpacity>
          </HStack>

          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            ml={3}
          >
            <ServicesSmallCard
              image={EngineService}
              alt="mecânico"
              title="Mecânico"
            />
            <ServicesSmallCard
              image={EletricService}
              alt="eletrico"
              title="Eletrica"
            />
            <ServicesSmallCard
              image={WashService}
              alt="limpeza"
              title="limpeza"
            />
            <ServicesSmallCard
              image={GearService}
              alt="cambio"
              title="Cambio"
            />
            <ServicesSmallCard
              image={AssistanceService}
              alt="assistencia"
              title="Assistencia"
            />
            <ServicesSmallCard
              image={AccessoriesService}
              alt="acessorios"
              title="Acessorios"
            />

            <ServicesSmallCard
              image={GlassService}
              alt="vidros"
              title="Vidros"
            />

            <ServicesSmallCard
              image={OilService}
              alt="fluidos"
              title="Fluidos"
            />

            <ServicesSmallCard
              image={PaintService}
              alt="funilaria e pintura"
              title="Pintura"
            />

            <ServicesSmallCard
              image={SuspensionService}
              alt="suspensão"
              title="Suspensão"
            />

            <ServicesSmallCard
              image={WhellService}
              alt="borracharia"
              title="Borracharia"
            />
          </ScrollView>
        </VStack>

        <VStack mt={5} px={5}>
          <Text bold mb={2} ml={3}>
            Parceiros Recomendados
          </Text>
          <TouchableOpacity>
            <VStack w={370} h={100} bg="white" rounded={5}></VStack>
          </TouchableOpacity>
        </VStack>

        <VStack px={5}>
          <HStack justifyContent={'space-between'} alignContent={'baseline'}>
            <Text bold mb={2}>
              Agendamentos
            </Text>
          </HStack>
          {schedules.length > 0 ? (
            schedules.map((schedule) => (
              <VStack
                borderWidth={1}
                borderColor="gray.700"
                mb={3}
                borderRadius={5}
                shadow={0.8}
                key={schedule.id}
              >
                <SmallSchedulleCard data={schedule} key={schedule.id} />
              </VStack>
            ))
          ) : (
            <VStack px={10} py={5}>
              <Center>
                <Text color="gray.400">Você não possui agendamentos</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('schedules')}
                >
                  <Text color="orange.600" bold>
                    Toque aqui para agendar
                  </Text>
                </TouchableOpacity>
              </Center>
            </VStack>
          )}
        </VStack>
      </VStack>
    </ScrollView>
  );
}
