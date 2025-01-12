/* eslint-disable no-nested-ternary */
import FirstImage from '@assets/welcome/first.png';
import FourthImage from '@assets/welcome/fourth.png';
import SecondImage from '@assets/welcome/second.png';
import ThirdImage from '@assets/welcome/third.png';
import { Button } from '@components/Button';
import { Tutorial } from '@components/Tutorial';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigatorRoutesProps } from '@routes/auth.routes';
import { VStack, Text, Center } from 'native-base';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native';

export function Welcome() {
  const [page, setPage] = useState(1);

  const navigation = useNavigation<AuthNavigatorRoutesProps>();

  function handleNextPage() {
    if (page === 4) {
      setPage(0);
    } else {
      setPage(page + 1);
    }
  }

  return (
    <VStack flex={1} px={10}>
      {page !== 5 && (
        <TouchableOpacity
          onPress={() => navigation.navigate('SignUp')}
          style={{ marginTop: 20 }}
        >
          <Text
            color="gray.100"
            fontSize="sm"
            textAlign="right"
            pt={5}
            fontWeight="bold"
          >
            Pular
          </Text>
        </TouchableOpacity>
      )}
      {page === 1 ? (
        <Tutorial
          title={'Oficinas Mecânicas'}
          text={
            'A oficina mecânica que você procura pode estar perto da sua casa.'
          }
          source={FirstImage}
          alt="Carro em um elevador"
          btnText={'Avançar'}
          nextPage={() => handleNextPage()}
        />
      ) : page === 2 ? (
        <Tutorial
          title={'Agende a sua manutenção'}
          text={
            'Te ajudamos a agendar a manutenção do seu veículo com um de  nossos parceiros.'
          }
          source={SecondImage}
          alt={'Uma garota com um relógio'}
          btnText={'Avançar'}
          nextPage={() => handleNextPage()}
        />
      ) : page === 3 ? (
        <Tutorial
          title={'Socorro 24 horas'}
          text={'Peça socorro de profissionais 24 horas por dia'}
          btnText={'Avançar'}
          source={ThirdImage}
          alt="Carro sendo guinchado"
          nextPage={() => handleNextPage()}
        />
      ) : page === 4 ? (
        <Center>
          <Tutorial
            title={'Encontre Clientes'}
            text={'Encontre clientes e aumente suas receita.'}
            source={FourthImage}
            alt="Duas pessoas se cumprimentando"
          />

          <Button
            title={'Tudo bem, vamos lá!'}
            onPress={() => navigation.navigate('SignUp')}
            mb={5}
          />
        </Center>
      ) : // ) : page === 5 ? (
      //   <Center flex={1}>
      //     <Heading fontFamily="heading" color="gray.100" pb={10}>
      //       Quem é você?
      //     </Heading>
      //     <Button
      //       title={"Sou um Cliente"}
      //       onPress={() => navigation.navigate("clientSignUp")}
      //       mb={5}
      //     />
      //     <Button
      //       title={"Sou um Parceiro"}
      //       onPress={() => navigation.navigate("partnerSignUp")}
      //     />
      //   </Center>
      null}
    </VStack>
  );
}
