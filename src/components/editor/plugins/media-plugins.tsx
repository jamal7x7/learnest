'use client';

import { CaptionPlugin } from '@udecode/plate-caption/react';
import {
  AudioPlugin,
  FilePlugin,
  ImagePlugin,
  MediaEmbedPlugin,
  PlaceholderPlugin,
  VideoPlugin,
} from '@udecode/plate-media/react';

import { ImagePreview } from '~/components/editor/ui/image-preview';
import { MediaUploadToast } from '~/components/editor/ui/media-upload-toast';

export const mediaPlugins = [
  ImagePlugin.extend({
    options: { disableUploadInsert: true },
    render: { afterEditable: ImagePreview },
  }),
  MediaEmbedPlugin,
  VideoPlugin,
  AudioPlugin,
  FilePlugin,
  CaptionPlugin.configure({
    options: {
      plugins: [
        ImagePlugin,
        VideoPlugin,
        AudioPlugin,
        FilePlugin,
        MediaEmbedPlugin,
      ],
    },
  }),
  PlaceholderPlugin.configure({
    options: { disableEmptyPlaceholder: true },
    render: { afterEditable: MediaUploadToast },
  }),
] as const;
