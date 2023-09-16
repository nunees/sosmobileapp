import { AppHeader } from '@components/AppHeader';
import { Button } from '@components/Button';
import { UserPhoto } from '@components/UserPhoto';
import { ILocation } from '@dtos/ILocation';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '@hooks/useAuth';
import { useProfile } from '@hooks/useProfile';
import { useNavigation, useRoute } from '@react-navigation/native';
import { PartnerNavigatorRoutesProps } from '@routes/partner.routes';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import { IFileInfo } from 'expo-file-system';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import {
  VStack,
  Text,
  useToast,
  ScrollView,
  HStack,
  Icon,
  Image,
} from 'native-base';
import { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';

type RouteParamsProps = {
  locationId: string;
};

const paymentMethods = [
  { id: 1, name: 'Dinheiro' },
  { id: 2, name: 'Crédito' },
  { id: 3, name: 'Débito' },
  { id: 4, name: 'PIX' },
  { id: 5, name: 'Transferencia' },
  { id: 6, name: 'Outros' },
];

const servicesCategories = [
  { id: 1, name: 'Acessorios' },
  { id: 2, name: 'Cambio' },
  { id: 3, name: 'Eletrica' },
  { id: 4, name: 'Fluidos' },
  { id: 5, name: 'Funilaria e Pintura' },
  { id: 6, name: 'Lavagem' },
  { id: 7, name: 'Mecanica' },
  { id: 8, name: 'Pneus' },
  { id: 9, name: 'Suspensão' },
  { id: 10, name: 'Vidros' },
  { id: 11, name: 'Outros' },
];

export function LocationDetails() {
  const [location, setLocation] = useState<ILocation>({} as ILocation);
  const [isPhotoLoading, setIsPhotoLoading] = useState(false);

  const routes = useRoute();
  const toast = useToast();
  const { user } = useAuth();
  const { profile } = useProfile();

  const { locationId } = routes.params as RouteParamsProps;
  const navigation = useNavigation<PartnerNavigatorRoutesProps>();

  async function handleFetchLocationDetails() {
    try {
      const response = await api.get(`/locations/${locationId}`, {
        headers: {
          id: user.id,
        },
      });

      setLocation(response.data);
    } catch (error) {
      toast.show({
        title: 'Erro ao carregar detalhes da localização',
        placement: 'top',
        bgColor: 'red.500',
      });
    }
  }

  async function handleUserProfilePictureSelect() {
    try {
      setIsPhotoLoading(true);
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      });

      if (photoSelected.canceled) {
        return;
      }

      if (photoSelected.assets[0].uri) {
        const photoInfo = (await FileSystem.getInfoAsync(
          photoSelected.assets[0].uri
        )) as IFileInfo;

        if (photoInfo?.size && photoInfo.size / 1021 / 1024 > 5) {
          toast.show({
            title: 'A imagem deve ter no máximo 5MB',
            placement: 'top',
            bgColor: 'red.500',
          });
        }

        const fileExtension = photoSelected.assets[0].uri.split('.').pop();

        const photoFile = {
          name: `${user.username}.${fileExtension}`.toLowerCase(),
          uri: photoSelected.assets[0].uri,
          type: `${photoSelected.assets[0].type}/${fileExtension}`,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any;

        const userPhotoUploadForm = new FormData();
        userPhotoUploadForm.append('photo', photoFile);

        await api.patch(
          `/locations/upload/new/${location.id}`,
          userPhotoUploadForm,
          {
            headers: {
              id: user.id,
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        toast.show({
          title: 'Foto atualizada',
          placement: 'top',
          bgColor: 'green.500',
        });
        setIsPhotoLoading(false);
      }
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Erro na atualização';
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsPhotoLoading(false);
      await handleFetchLocationDetails();
    }
  }

  async function deletePhoto(photo: string) {
    try {
      const response = await api.delete(`/locations/photo/${photo}`, {
        headers: {
          id: user.id,
        },
      });

      toast.show({
        title: response.data.message ?? 'Foto deletada',
        placement: 'top',
        bgColor: 'green.500',
      });
      await handleFetchLocationDetails();
    } catch (error) {
      toast.show({
        title: 'Erro ao deletar foto',
        placement: 'top',
        bgColor: 'red.500',
      });
    }
  }

  useEffect(() => {
    handleFetchLocationDetails();
  }, []);

  return (
    <VStack>
      <VStack>
        <AppHeader title="Detalhes" />
      </VStack>

      <VStack px={5} py={5}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 120,
          }}
        >
          <VStack backgroundColor="white" borderRadius={10} p={5}>
            <HStack>
              <VStack>
                <UserPhoto
                  source={{
                    uri: user.avatar
                      ? `${api.defaults.baseURL}/user/avatar/${user.id}/${user.avatar}`
                      : `https://ui-avatars.com/api/?format=png&name=${user.name}+${profile.last_name}&size=512`,
                  }}
                  alt="Foto de perfil"
                  size={20}
                />
              </VStack>
              <VStack>
                <VStack position={'absolute'} left={220} bottom={60}>
                  <Icon
                    as={Feather}
                    name="message-square"
                    size={5}
                    ml={3}
                    mt={5}
                    color="amber.600"
                  />
                </VStack>
                <VStack ml={3} mt={2}>
                  <Text bold>{user.name}</Text>
                  <Text>0 avaliacoes</Text>
                  <Text>{location.business_name}</Text>
                  <Text>{location.business_phone}</Text>
                </VStack>
              </VStack>
            </HStack>
          </VStack>

          <VStack px={5} mt={10}>
            <HStack>
              <HStack>
                <Icon
                  as={Feather}
                  name="briefcase"
                  size={5}
                  ml={3}
                  color="amber.600"
                />
                <VStack ml={2}>
                  <Text>CNPJ/CPF: {location.cnpj}</Text>
                </VStack>
              </HStack>
            </HStack>
          </VStack>

          <VStack px={5} mt={5}>
            <HStack>
              <HStack>
                <Icon
                  as={Feather}
                  name="map-pin"
                  size={5}
                  ml={3}
                  mt={5}
                  color="amber.600"
                />
                <VStack ml={2}>
                  <Text>
                    {location.address_line},{location.number}-
                    {location.district}
                  </Text>
                  <Text>
                    {location.city}-{location.state}
                  </Text>
                  <Text>{location.zipcode}</Text>
                </VStack>
              </HStack>
            </HStack>
          </VStack>

          <VStack px={5} mt={5}>
            <HStack>
              <HStack>
                <Icon
                  as={Feather}
                  name="mail"
                  size={5}
                  ml={3}
                  color="amber.600"
                />
                <VStack ml={2}>
                  <Text>{location.business_email}</Text>
                </VStack>
              </HStack>
            </HStack>
          </VStack>

          <VStack px={5} mt={5}>
            <HStack>
              <HStack>
                <Icon
                  as={Feather}
                  name="info"
                  size={5}
                  ml={3}
                  color="amber.600"
                />
                <VStack ml={2} w={300}>
                  <Text textAlign="justify">
                    {location.business_description}
                  </Text>
                </VStack>
              </HStack>
            </HStack>
          </VStack>

          <VStack px={5} mt={5}>
            <HStack>
              <HStack>
                <Icon
                  as={Feather}
                  name="dollar-sign"
                  size={5}
                  ml={3}
                  color="amber.600"
                />
                <VStack ml={2} w={300}>
                  {location.payment_methods?.map((payment) => {
                    return (
                      <HStack key={payment}>
                        <HStack>
                          <VStack ml={2}>
                            <Text>
                              {
                                paymentMethods.find((method) =>
                                  method.id === payment ? method.name : ''
                                )?.name
                              }
                            </Text>
                          </VStack>
                        </HStack>
                      </HStack>
                    );
                  })}
                </VStack>
              </HStack>
            </HStack>
          </VStack>

          <VStack px={5} mt={5}>
            <HStack>
              <HStack>
                <Icon
                  as={Feather}
                  name="tool"
                  size={5}
                  ml={3}
                  color="amber.600"
                />
                <VStack ml={2} w={300}>
                  {location.business_categories?.map((category) => {
                    return (
                      <HStack key={category}>
                        <HStack>
                          <VStack ml={2}>
                            <Text>
                              {
                                servicesCategories.find((service) =>
                                  service.id === category ? service.name : ''
                                )?.name
                              }
                            </Text>
                          </VStack>
                        </HStack>
                      </HStack>
                    );
                  })}
                </VStack>
              </HStack>
            </HStack>
          </VStack>

          <VStack px={5} mt={5}>
            <HStack>
              <HStack>
                <Icon
                  as={Feather}
                  name="calendar"
                  size={5}
                  ml={3}
                  color="amber.600"
                />
                <VStack ml={2} w={300}>
                  {location.open_hours_weekend?.map((category) => {
                    return (
                      <HStack key={category}>
                        <VStack>
                          <HStack ml={2}>
                            <Text>{category}</Text>
                          </HStack>
                        </VStack>
                      </HStack>
                    );
                  })}
                </VStack>
              </HStack>
            </HStack>
          </VStack>

          <VStack px={5} mt={5}>
            <HStack>
              <HStack>
                <Icon
                  as={Feather}
                  name="clock"
                  size={5}
                  ml={3}
                  color="amber.600"
                />
                <VStack ml={4} w={300}>
                  {location.open_hours?.length > 1 ? (
                    <Text>{location.open_hours}</Text>
                  ) : (
                    <Text color="red.500">
                      Voce deve adicionar seus horarios para poder receber
                      clientes!
                    </Text>
                  )}
                </VStack>
              </HStack>
            </HStack>
          </VStack>

          <VStack px={5} mt={10}>
            <HStack>
              <HStack>
                <Icon
                  as={Feather}
                  name="clock"
                  size={5}
                  ml={3}
                  color="amber.600"
                />
                <VStack ml={2}>
                  <Text>
                    Criado em:{' '}
                    {new Date(location.created_at!).toLocaleDateString('pt-br')}
                  </Text>
                </VStack>
              </HStack>
            </HStack>
          </VStack>

          <VStack px={5} mt={5}>
            <HStack>
              <HStack>
                <Icon
                  as={Feather}
                  name="image"
                  size={5}
                  ml={3}
                  color="amber.600"
                />
                <VStack ml={2} w={300}>
                  {location.photos &&
                    location.photos.map((photo) => {
                      return (
                        <HStack key={photo}>
                          <HStack>
                            <VStack ml={2}>
                              <Text>{photo}</Text>
                            </VStack>
                          </HStack>
                        </HStack>
                      );
                    })}

                  {location.LocationsPhotos?.length === 0 ? (
                    <VStack mb={5}>
                      <Text>
                        Adicione fotos ao seu local e atraia mais clientes
                      </Text>
                    </VStack>
                  ) : (
                    <VStack mb={5}>
                      {location.LocationsPhotos?.map((photo) => (
                        <VStack
                          mb={5}
                          borderWidth={2}
                          borderColor={'orange.700'}
                        >
                          <Image
                            key={photo.id}
                            source={{
                              uri: `${api.defaults.baseURL}/locations/photo/${location.id}/${photo.photo}`,
                            }}
                            alt="local"
                            w={400}
                            h={400}
                          />
                          <VStack
                            w={60}
                            h={8}
                            position={'absolute'}
                            bottom={0}
                            left={0}
                            borderTopRightRadius={10}
                            borderTopLeftRadius={0}
                            bg={'orange.900'}
                            alignItems={'center'}
                            justifyItems={'center'}
                          >
                            <TouchableOpacity
                              onPress={() => deletePhoto(photo.id!)}
                            >
                              <Icon
                                as={Feather}
                                name="trash-2"
                                size={7}
                                color="white"
                              />
                            </TouchableOpacity>
                          </VStack>
                        </VStack>
                      ))}
                    </VStack>
                  )}
                  <Button
                    title={
                      location.LocationsPhotos?.length === 0
                        ? '+ Adicionar photo'
                        : '+ Adicionar mais fotos'
                    }
                    onPress={handleUserProfilePictureSelect}
                    h={50}
                    variant={'outline'}
                  />

                  <Button
                    title="Editar Local"
                    onPress={() =>
                      navigation.navigate('editLocation', {
                        locationId: location.id,
                      })
                    }
                    h={50}
                    mt={100}
                  />
                </VStack>
              </HStack>
            </HStack>
          </VStack>
        </ScrollView>
      </VStack>
    </VStack>
  );
}