# Long posts

`tweet` and `reply` select CreateNoteTweet above 280 weighted characters using twitter-text 3.1.0 (NFC normalization, URLs = 23, CJK and emoji sequences = 2). At 280 or below the existing CreateTweet request and fallback remain unchanged. Long posts never fall back to statuses/update. Failures preserve the upstream reason and explain the Premium requirement; they do not infer subscription status from a generic rejection.

## Bundle evidence (2026-11-04)

Source: https://abs.twimg.com/responsive-web/client-web/main.0a76dc3677efe2b2a.js

- Module 262744 exports queryId `seOZkIS8AysCGfPo6yYPVA`, operationName `CreateNoteTweet`, and its featureSwitches metadata.
- The shared `z({featureSwitches:e,options:t})` builder includes tweet_text, media, reply, semantic_annotation_ids, and disallowed_reply_options (null without controls). Optional undefined fields disappear during JSON serialization. It supplies no dark_request.
- The create method branches on the long-post predicate and invokes this mutation, reading `notetweet_create.tweet_results.result`.
- Feature values below were read from authenticated /home bootstrap configuration, limited to that operation's declared switches. Two absent switches (rweb_conversational_replies_downvote_enabled and responsive_web_made_on_x_label_enabled) use false, matching isTrue for absent flags. No bootstrap account data or credentials are retained. Existing file/env feature overrides still apply through the distinct noteTweetCreate set.
- Logged-out pages currently serve a different x-web Relay client. Client 404 recovery therefore supplies an authenticated page fetch to the existing runtime ID store. Cookies are sent only to fixed x.com discovery pages, redirects are rejected, and bundle fetches remain unauthenticated. The cache retains only IDs and public discovery URLs. Live read-only refresh returned this same ID from main.0a76dc3677efe2b2a.js. The standalone query-ids command still uses public discovery and may find no legacy bundles.

## Exact long-post request example

POST https://x.com/i/api/graphql/seOZkIS8AysCGfPo6yYPVA/CreateNoteTweet

Default body for 281 ASCII letters, without feature overrides:

```json
{
  "variables": {
    "tweet_text": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    "media": {
      "media_entities": [],
      "possibly_sensitive": false
    },
    "semantic_annotation_ids": [],
    "disallowed_reply_options": null
  },
  "features": {
    "premium_content_api_read_enabled": false,
    "communities_web_enable_tweet_community_results_fetch": true,
    "c9s_tweet_anatomy_moderator_badge_enabled": true,
    "responsive_web_grok_analyze_button_fetch_trends_enabled": false,
    "responsive_web_grok_analyze_post_followups_enabled": false,
    "rweb_cashtags_composer_attachment_enabled": true,
    "responsive_web_jetfuel_frame": true,
    "rweb_sports_post_context_enabled": true,
    "x_elections_post_context_enabled": true,
    "responsive_web_grok_share_attachment_enabled": true,
    "responsive_web_grok_annotations_enabled": true,
    "responsive_web_edit_tweet_api_enabled": true,
    "graphql_is_translatable_rweb_tweet_is_translatable_enabled": true,
    "view_counts_everywhere_api_enabled": true,
    "longform_notetweets_consumption_enabled": true,
    "responsive_web_twitter_article_tweet_consumption_enabled": true,
    "content_disclosure_indicator_enabled": true,
    "content_disclosure_ai_generated_indicator_enabled": true,
    "responsive_web_grok_show_grok_translated_post": true,
    "responsive_web_grok_analysis_button_from_backend": true,
    "post_ctas_fetch_enabled": false,
    "longform_notetweets_rich_text_read_enabled": true,
    "longform_notetweets_inline_media_enabled": false,
    "profile_label_improvements_pcf_label_in_post_enabled": true,
    "responsive_web_profile_redirect_enabled": true,
    "rweb_tipjar_consumption_enabled": false,
    "verified_phone_label_enabled": false,
    "responsive_web_nested_quote_preview_enabled": true,
    "articles_preview_enabled": true,
    "rweb_cashtags_enabled": true,
    "responsive_web_grok_community_note_auto_translation_is_enabled": true,
    "freedom_of_speech_not_reach_fetch_enabled": true,
    "standardized_nudges_misinfo": true,
    "tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled": true,
    "responsive_web_grok_image_annotation_enabled": true,
    "responsive_web_grok_imagine_annotation_enabled": true,
    "responsive_web_graphql_timeline_navigation_enabled": true,
    "rweb_conversational_replies_downvote_enabled": false,
    "responsive_web_made_on_x_label_enabled": false
  },
  "queryId": "seOZkIS8AysCGfPo6yYPVA"
}
```

Replies additionally include `reply: {in_reply_to_tweet_id, exclude_reply_user_ids: []}`; attachments populate `media.media_entities` with `{media_id, tagged_users: []}`.

## Verification

- Added cases in the existing posting test file failed before implementation: 6 failed, 20 passed; after implementation: 26 passed. URL, emoji sequence and CJK boundary pairs exercise mutation selection. Long replies with media assert variables and parsed ID; rejection asserts no REST fallback. Existing runtime-query-ids tests exercise note discovery and separate page/bundle fetches.
- Canonical check: `pnpm install --frozen-lockfile && pnpm check`. Both lint engines, TypeScript build, and 432 tests passed; 39 opt-in live tests were skipped.
- Compared installed @steipete/bird 0.8.0 compiled posting, read, tweet-detail, utils, base, and users command implementations against the fork build. No needed posting/read/whoami feature was missing. The base's unrelated 404 helper and users command refactors do not affect these calls; the fork's limiter and abort-signal handling were preserved.
- Global fork installed via pnpm local link after removing the conflicting @steipete/bird global package. The Keychain wrapper is unchanged. Version: 0.8.1-uxheavy.0.
- Installed wrapper whoami succeeded as @qhuy_uxheavy / 1851007458397036544. Read 2117180859724001661 --json-full succeeded: likeCount 1, replyCount 0, retweetCount 0, _raw.views.count "46". Counts are a point-in-time observation. Raw quote_count and bookmark_count remain available in _raw.
- Unproven: X accepting and publishing a long post, long media upload/publication, long reply publication, actual non-Premium rejection, and the resulting public status URL. No post, reply, or delete was attempted. Mocked requests prove construction and parsing only. The orchestrator owns independent review and first real publication.
