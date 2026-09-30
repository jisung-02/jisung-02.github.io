# Audio sources and processing

The following recordings were published under **CC0 / public domain** by their uploaders. Licence confirmation, original page and downloaded high-quality preview URLs are retained in `source/sources.json`. The source directory is excluded from Godot's asset import; the game plays locally edited WAV files.

| Recording | Creator | Original page | Game use |
|---|---|---|---|
| Solo Clap | OwlStorm / Ashe Kirk | https://freesound.org/people/OwlStorm/sounds/151219/ | Trimmed, varied palm impacts; low-pass filtered for the dull newspaper contact layer (legacy plastic impact files are retained) |
| Electric Sparks.wav | kev_durr | https://freesound.org/people/kev_durr/sounds/396470/ | Three short transients from a recorded high-voltage supply, used only on insect contact |
| Small Fan.wav | Thskk | https://freesound.org/people/Thskk/sounds/396963/ | Short crossfaded room fan loop and shaped intake bursts |
| Mosquito 1 Edit | IanFSA | https://freesound.org/people/IanFSA/sounds/662970/ | Short crossfaded mosquito flight loop, positioned by the nearest mosquito |
| electric effects_.wav | soundtracvkradio | https://freesound.org/people/soundtracvkradio/sounds/394679/ | Evaluated as a source; not used by the current game mix |

Air swishes, gentle leaf friction, sticky leaf contact, small water sounds, dragonfly wing flutter and switch clicks are **original procedural foley** created for this game. These layers are sound-design interpretations, not recordings of plants or dragonflies. No music or voice generation is used.

`tools/build_audio.py` reproduces the 36 short effects/loops using Python's standard library and ffmpeg. The edit process trims silence, normalizes peaks below clipping, varies pitch and adds a restrained room reflection to selected contacts. `game_audio.gd` uses a pool of separate positional voices so simultaneous captures do not cut each other off. Ambient fan/insect loops become silent during pause, the shop, game over or mute. M stops active effects immediately. The purchase click can still play in the shop when sound is enabled.

신문지 효과음: paper_swing_1–3.wav는 원본 종이 마찰·공기 폴리 합성, paper_hit_1–3.wav는 저역 필터를 거친 위 CC0 손뼉 녹음에 원본 종이 마찰·둔탁한 충격 합성을 섞었습니다. tools/build_audio.py --paper-only로 재생성할 수 있습니다.
