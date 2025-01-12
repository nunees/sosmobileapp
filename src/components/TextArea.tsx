import {
  TextArea as NativeTextArea,
  ITextAreaProps,
  FormControl,
} from 'native-base';

type Props = ITextAreaProps & {
  errorMessage?: string | null;
};

export function TextArea({ errorMessage = null, ...rest }: Props) {
  const invalid = !!errorMessage;
  return (
    <FormControl isInvalid={invalid} mb={4}>
      <NativeTextArea
        autoCompleteType={undefined}
        px={4}
        h={20}
        borderWidth={1}
        fontSize="sm"
        color="gray.400"
        placeholderTextColor="gray.500"
        isInvalid={invalid}
        _invalid={{
          borderWidth: 2,
          borderColor: 'red.500',
        }}
        _focus={{
          bg: 'white',
          borderColor: 'purple.500',
          borderWidth: 2,
        }}
        {...rest}
      />
      <FormControl.ErrorMessage>{errorMessage}</FormControl.ErrorMessage>
    </FormControl>
  );
}
