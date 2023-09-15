import {
  VStack,
  Text,
  Image,
  IImageProps,
  HStack,
  IPressableProps,
} from 'native-base';
import { ImageSourcePropType, Pressable } from 'react-native';

type Props = IImageProps &
  IPressableProps & {
    title: string;
    content: string;
    image: ImageSourcePropType;
    alt: string;
  };

export function ListServices({ image, alt, title, content, ...rest }: Props) {
  return (
    <Pressable {...rest}>
      <HStack w={390} mb={2} backgroundColor="white" p={5} borderRadius={10}>
        <Image source={image} alt={alt} w={20} h={20} {...rest} />
        <VStack pl={3} w={280}>
          <Text bold fontSize="md">
            {title}
          </Text>
          <Text textAlign="justify" color="gray.400">
            {content}
          </Text>
        </VStack>
      </HStack>
    </Pressable>
  );
}
