import { Text } from '@atoms';
import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
} from '@gorhom/bottom-sheet';
import { useGlobalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { closeSheet } from '@/lib/sheets';
import Container from './container';

export function RootBottomSheet() {
  const params = useGlobalSearchParams<Record<string, string>>();
  const ref = useRef<BottomSheetModal>(null);

  useEffect(() => {
    if (params.sheet) {
      ref.current?.present();
    } else {
      ref.current?.dismiss();
    }
  }, [params.sheet]);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
      />
    ),
    [],
  );

  const snapPoints = useMemo(() => {
    if (params.sheet === 'post-actions') return ['35%'];
    if (params.sheet === 'compose') return ['92%'];
    return ['50%'];
  }, [params.sheet]);

  const content = useMemo(() => {
    switch (params.sheet) {
      case 'compose':
        return (
          <Container>
            <Text>Compose view</Text>
          </Container>
        );
      case 'post-actions':
        return (
          <Container>
            <Text>Post actions</Text>
          </Container>
        );
      default:
        return null;
    }
  }, [params]);

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      onDismiss={closeSheet}
      backdropComponent={renderBackdrop}
      enablePanDownToClose
      keyboardBehavior="interactive"
    >
      {content}
    </BottomSheetModal>
  );
}
